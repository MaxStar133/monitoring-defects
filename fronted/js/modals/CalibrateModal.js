import { BaseModal } from '../core/BaseModal.js';

export class CalibrateModal extends BaseModal {
  constructor() {
    super("calibrate-modal", {
      closeOnEsc: true,
      closeOnOverlay: true
    });

    this.calibrateBtn = document.getElementById("calibrate-btn");
    this.cancelBtn = document.getElementById("calibrate-cancel");
    this.confirmBtn = document.getElementById("calibrate-confirm");

    if (!this.modal) return;

    this.initCalibrate();
  }

  handleCalibrateClick = (e) => {
    e.preventDefault();
    this.open();
  }

  handleCancelClick = () => {
    this.close();
  }

  handleConfirmClick = () => {
    console.log("Калибровка подтверждена");
    // Логика калибровки
    this.close();
  }

  initCalibrate() {
    this.calibrateBtn.addEventListener("click", this.handleCalibrateClick);
    this.cancelBtn.addEventListener("click", this.handleCancelClick);
    this.confirmBtn.addEventListener("click", this.handleConfirmClick);
  }

  destroy() {
    super.destroy();
    this.calibrateBtn.removeEventListener("click", this.handleCalibrateClick);
    this.cancelBtn.removeEventListener("click", this.handleCancelClick);
    this.confirmBtn.removeEventListener("click", this.handleConfirmClick);
  }
}