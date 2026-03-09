export class ImageManager {
  constructor() {
    this.init();
  }

  showImage(clickedLink) {
    const currentRow = clickedLink.closest(".detections-table-row");
    if (!currentRow) return;

    const rowIndex = Array.from(
      document.querySelectorAll(".detections-table-row")
    ).indexOf(currentRow);

    let imageRow = document.getElementById(`image-row-${rowIndex}`);

    if (!imageRow) {
      imageRow = this.createImageRow(currentRow, rowIndex);
      currentRow.parentNode.insertBefore(imageRow, currentRow.nextSibling);
    }

    currentRow.style.display = "none";
    imageRow.style.display = "block";

    const hideLink = imageRow.querySelector(".hide-image");
    if (hideLink) {
      hideLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.hideImage(e.target);
      });
    }
  }

  createImageRow(currentRow, rowIndex) {
    const imageRow = document.createElement("div");
    imageRow.className = "detections-image-row";
    imageRow.id = `image-row-${rowIndex}`;
    imageRow.style.display = "none";

    const dateCell = currentRow.querySelector(".detections-table-row__cell--date");
    const measurements = currentRow.querySelectorAll(".detections-table-row__value");
    const statusCell = currentRow.querySelector(".detections-table-row__cell--status");

    const dateHtml = dateCell ? dateCell.innerHTML : "";
    const length = measurements[0] ? measurements[0].textContent : "120";
    const width = measurements[1] ? measurements[1].textContent : "120";
    const area = measurements[2] ? measurements[2].textContent : "150";
    const statusText = statusCell ? statusCell.textContent : "Критичный";
    const statusClass = statusCell ? statusCell.className : "status--critical";

    imageRow.innerHTML = `
      <div class="detections-image-container">
        <div class="detections-table-row">
          <div class="detections-table-row__cell detections-table-row__cell--date">
            ${dateHtml}
          </div>
          <div class="detections-table-row__measurements">
            <span class="detections-table-row__value">${length}</span>
            <span class="detections-table-row__value">${width}</span>
            <span class="detections-table-row__value">${area}</span>
          </div>
          <div class="detections-table-row__cell detections-table-row__cell--status ${statusClass}">
            ${statusText}
          </div>
          <div class="detections-table-row__cell detections-table-row__cell--actions">
            <a href="#" class="detections-table-row__link hide-image">Скрыть</a>
          </div>
        </div>
        <div class="detections-image-frame">
          <div class="detections-image-wrapper">
            <img src="../images/detection-defect.png" alt="Дефект" class="detections-image">
          </div>
        </div>
      </div>
    `;

    return imageRow;
  }

  hideImage(clickedElement) {
    const imageRow = clickedElement.closest(".detections-image-row");
    if (!imageRow) return;

    const prevRow = imageRow.previousElementSibling;
    if (prevRow && prevRow.classList.contains("detections-table-row")) {
      prevRow.style.display = "";
    }

    imageRow.remove();
  }

  init() {
    document.querySelectorAll(".detections-table-row__link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        if (!link.classList.contains("hide-image")) {
          this.showImage(link);
        }
      });
    });
  }

  destroy() {
    document.querySelectorAll(".detections-table-row__link").forEach((link) => {
      link.removeEventListener("click", this.showImage);
    });
  }
}