
(() => {
  function addDropdown(inputId, defaultOptions, placeholderText) {
    const input = document.getElementById(inputId);
    const dropdownId = `${inputId}-dropdown`;
    const storageKey = `recording-metadata-options-${inputId}`;

    // The input may not exist yet, or the dropdown may already exist.
    if (!input || document.getElementById(dropdownId)) {
      return;
    }

    // Load saved options, falling back to defaults.
    function loadOptions() {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved !== null) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter(
              (value) => typeof value === "string"
            );
          }
        }
      } catch (error) {
        console.warn(`Could not load options for ${inputId}`, error);
      }

      return [...defaultOptions];
    }

    let options = loadOptions();

    function saveOptions() {
      try {
        localStorage.setItem(storageKey, JSON.stringify(options));
      } catch (error) {
        console.warn(`Could not save options for ${inputId}`, error);
      }
    }

    const dropdown = document.createElement("select");
    dropdown.id = dropdownId;

    dropdown.style.display = "block";
    dropdown.style.width = "100%";
    dropdown.style.marginTop = "5px";

    function renderOptions() {
      const currentValue = input.value.trim();

      dropdown.replaceChildren();

      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = placeholderText;
      dropdown.appendChild(placeholder);

      options.forEach((option) => {
        const item = document.createElement("option");
        item.value = option;
        item.textContent = option;
        dropdown.appendChild(item);
      });

      // Offer to save the current input if it isn't already an option.
      if (
        currentValue &&
        !options.some(
          (option) => option.toLowerCase() === currentValue.toLowerCase()
        )
      ) {
        const addOption = document.createElement("option");
        addOption.value = "__add_current_value__";
        addOption.textContent = `+ Add "${currentValue}" to saved options`;
        dropdown.appendChild(addOption);
      }
    }

    function notifyInputChanged() {
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    dropdown.addEventListener("change", () => {
      const selectedValue = dropdown.value;

      if (selectedValue === "__add_current_value__") {
        const newValue = input.value.trim();

        if (
          newValue &&
          !options.some(
            (option) => option.toLowerCase() === newValue.toLowerCase()
          )
        ) {
          options.push(newValue);
          saveOptions();
        }

        renderOptions();

        // Select the newly saved value.
        dropdown.value = newValue;
        return;
      }

      if (selectedValue) {
        input.value = selectedValue;
        notifyInputChanged();
      }
    });

    // Refresh the "Add current value" choice as the user types.
    input.addEventListener("input", renderOptions);

    renderOptions();
    input.insertAdjacentElement("afterend", dropdown);
  }

  function addDropdownForRecordingDevice() {
    addDropdown(
      "recording-device",
      [
        "Sound Devices MixPre3-II",
        "Raspberry Pi",
        "Other",
      ],
      "Select recording device..."
    );
  }

  function addDropdownForMicrophones() {
    addDropdown(
      "recording-microphone",
      [
        "Clippy XLR EM272Z1",
        "Dodotronics Hi-Sound Stereo",
        "Sennheiser ME66",
        "Primo EM272 capsule with parabolic mic from https://www.parabolicmicrophone.co.uk",
        "Telinga PIP",
      ],
      "Select microphone..."
    );
  }

  function initialiseDropdowns() {
    addDropdownForRecordingDevice();
    addDropdownForMicrophones();
  }

  // Try immediately.
  initialiseDropdowns();

  // Also handle inputs added dynamically.
  const observer = new MutationObserver(initialiseDropdowns);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
