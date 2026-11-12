import csv
import html
import re
from datetime import datetime, timedelta, timezone
from decimal import Decimal, InvalidOperation
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "sheets" / "cijene - sheet1.csv"
LATEST = ROOT / "pricelist-latest.csv"
ARCHIVE = ROOT / "pricelists"
ARCHIVE_INDEX = ARCHIVE / "index.html"
OUTLET_FORM = "prodaja-po-narudzbi"
OUTLET_ADDRESS = "Lektrscica-5-Zagreb"
OUTLET_IDENTIFIER = "STARDI-01"
STORAGE_NUMBER = "01"
ARCHIVE_PATTERN = re.compile(
    rf"{re.escape(OUTLET_FORM)}_{re.escape(OUTLET_ADDRESS)}_"
    rf"{re.escape(OUTLET_IDENTIFIER)}_{re.escape(STORAGE_NUMBER)}_"
    r"(\d{4}-\d{2}-\d{2})T\d{6}Z\.csv"
)
OUTPUT_FIELDS = (
    "item_name",
    "current_price_eur",
    "anchor_price_eur",
    "last_updated",
)


def parse_price(value, row_number, field):
    normalized = re.sub(r"[^\d,.-]", "", value)
    if "," in normalized and "." not in normalized:
        normalized = normalized.replace(",", ".")

    try:
        amount = Decimal(normalized)
    except InvalidOperation as error:
        raise ValueError(f"Invalid {field} on source row {row_number}: {value!r}") from error

    if not amount.is_finite() or amount < 0:
        raise ValueError(f"Invalid {field} on source row {row_number}: {value!r}")

    return f"{amount:.2f}"


def load_products():
    with SOURCE.open(encoding="utf-8-sig", newline="") as source_file:
        reader = csv.DictReader(source_file)
        required_fields = {"name", "price", "anchor_price_eur"}
        missing_fields = required_fields.difference(reader.fieldnames or ())
        if missing_fields:
            raise ValueError(f"Missing source CSV fields: {', '.join(sorted(missing_fields))}")

        products = []
        for row_number, row in enumerate(reader, start=2):
            name = (row.get("name") or "").strip()
            if not name:
                raise ValueError(f"Missing item name on source row {row_number}")

            products.append(
                {
                    "item_name": name,
                    "current_price_eur": parse_price(row["price"], row_number, "price"),
                    "anchor_price_eur": parse_price(
                        row["anchor_price_eur"], row_number, "anchor_price_eur"
                    ),
                }
            )

    if not products:
        raise ValueError("The source CSV contains no products")

    return products


def write_pricelist(path, products, updated_at):
    with path.open("w", encoding="utf-8", newline="") as output_file:
        writer = csv.DictWriter(output_file, fieldnames=OUTPUT_FIELDS)
        writer.writeheader()
        for product in products:
            writer.writerow({**product, "last_updated": updated_at})


def prune_archive(today):
    cutoff = today - timedelta(days=30)
    for path in ARCHIVE.iterdir():
        match = ARCHIVE_PATTERN.fullmatch(path.name)
        if not match or not path.is_file():
            continue

        try:
            archived_date = datetime.strptime(match.group(1), "%Y-%m-%d").date()
        except ValueError:
            continue

        if archived_date < cutoff:
            path.unlink()


def write_archive_index():
    files = sorted(
        (path for path in ARCHIVE.iterdir() if ARCHIVE_PATTERN.fullmatch(path.name)),
        key=lambda path: path.name,
        reverse=True,
    )
    links = "\n".join(
        f'<li><a href="{html.escape(path.name, quote=True)}">{html.escape(path.stem)}</a></li>'
        for path in files
    )
    content = f"""<!DOCTYPE html>
<html lang="hr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Arhiva cjenika | STARDI CERAMICS</title>
</head>
<body>
    <main>
        <h1>Arhiva cjenika</h1>
        <p><a href="../pricelist-latest.csv">Preuzmite aktualni cjenik (CSV)</a></p>
        <ul>
{links}
        </ul>
    </main>
</body>
</html>
"""
    ARCHIVE_INDEX.write_text(content, encoding="utf-8")


def main():
    now = datetime.now(timezone.utc)
    today = now.date()
    updated_at = now.isoformat(timespec="seconds").replace("+00:00", "Z")
    archive_name = (
        f"{OUTLET_FORM}_{OUTLET_ADDRESS}_{OUTLET_IDENTIFIER}_{STORAGE_NUMBER}_"
        f"{now.strftime('%Y-%m-%dT%H%M%SZ')}.csv"
    )
    products = load_products()

    ARCHIVE.mkdir(parents=True, exist_ok=True)
    write_pricelist(LATEST, products, updated_at)
    write_pricelist(ARCHIVE / archive_name, products, updated_at)
    prune_archive(today)
    write_archive_index()


if __name__ == "__main__":
    main()
