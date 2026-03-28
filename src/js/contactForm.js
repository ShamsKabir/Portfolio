export function initFormValidation() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  // Real-time validation
  const inputs = form.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("blur", () => {
      validateField(input);
    });

    input.addEventListener("input", () => {
      if (input.classList.contains("error")) {
        validateField(input);
      }
    });
  });

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Validate all fields
    let isValid = true;
    inputs.forEach((input) => {
      if (!validateField(input)) isValid = false;
    });

    if (!isValid) return;

    // Submit form
    try {
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        submitBtn.textContent = "Message Sent!";
        form.reset();
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 3000);
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      submitBtn.textContent = "Error - Try Again";
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 3000);
    }
  });

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    // Remove existing error styling
    field.classList.remove("error");
    field.style.borderColor = "";

    // Validation rules
    switch (field.name) {
      case "name":
        if (!value) {
          isValid = false;
          errorMessage = "Name is required";
        } else if (value.length < 2) {
          isValid = false;
          errorMessage = "Name must be at least 2 characters";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          isValid = false;
          errorMessage = "Email is required";
        } else if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = "Please enter a valid email";
        }
        break;
      case "message":
        if (!value) {
          isValid = false;
          errorMessage = "Message is required";
        } else if (value.length < 10) {
          isValid = false;
          errorMessage = "Message must be at least 10 characters";
        }
        break;
    }

    if (!isValid) {
      field.classList.add("error");
      field.style.borderColor = "#ff6b6b";

      // Create or update error message
      let errorEl = field.parentNode.querySelector(".error-message");
      if (!errorEl) {
        errorEl = document.createElement("div");
        errorEl.className = "error-message text-red-400 text-sm mt-1";
        field.parentNode.appendChild(errorEl);
      }
      errorEl.textContent = errorMessage;
    } else {
      // Remove error message
      const errorEl = field.parentNode.querySelector(".error-message");
      if (errorEl) errorEl.remove();
    }

    return isValid;
  }
}