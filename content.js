
(() => {
  function addDropdown(inputId, options, placeholderText) {
    const input = document.getElementById(inputId);
    const dropdownId = `${inputId}-dropdown`
    // The input may not exist yet, or the dropdown may already exist.
    if (!input || document.getElementById(dropdownId)) {
      return;
    }

    const dropdown = document.createElement("select");
    dropdown.id = dropdownId;

    // Add a placeholder option.
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = placeholderText;
    placeholder.selected = true;
    dropdown.appendChild(placeholder);

    options.forEach((option) => {
      const item = document.createElement("option");
      item.value = option;
      item.textContent = option;
      dropdown.appendChild(item);
    });

    // Basic styling to match the input width.
    dropdown.style.display = "block";
    dropdown.style.width = "100%";
    dropdown.style.marginTop = "5px";

    dropdown.addEventListener("change", () => {
      if (dropdown.value && dropdown.value !== "Other") {
        input.value = dropdown.value;

        // Notify the page of the change, in case it uses event listeners.
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });

    // Insert directly underneath the input.
    input.insertAdjacentElement("afterend", dropdown);
  }

  function addDropdownForRecordingDevice() {
    addDropdown("recording-device", [
    "Sound Devices MixPre3-II",
    "Raspberry Pi",
    "Other",
  ],
  "Select recording device...")
  }

  function addDropdownForMicrophones() {
    addDropdown("recording-microphone", [
    "Clippy XLR EM272Z1",
    "Dodotronics Hi-Sound Stereo",
    "Sennheiser ME66",
    "Primo EM272 capsule with parabolic mic from https://www.parabolicmicrophone.co.uk",
    "Telinga PIP"
  ],
  "Select microphone")
  }

  // Try immediately.
  addDropdownForRecordingDevice();
  addDropdownForMicrophones();

  // Also handle pages where the input is added dynamically.
  const observer = new MutationObserver(addDropdownForRecordingDevice);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
