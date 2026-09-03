(() => {
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/maeybwkz";

  document.querySelectorAll(".js-lead-form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const status = form.querySelector(".lead-status");
      const submit = form.querySelector('button[type="submit"]');
      const data = new FormData(form);

      if (data.get("company")) return;

      if (!form.checkValidity()) {
        status.textContent = "Please complete the required fields.";
        status.className = "lead-status error";
        form.reportValidity();
        return;
      }

      const zip = String(data.get("zip") || "").trim();
      if (!/^\d{5}(-\d{4})?$/.test(zip)) {
        status.textContent = "Please enter a valid ZIP code.";
        status.className = "lead-status error";
        form.querySelector('[name="zip"]').focus();
        return;
      }

      submit.disabled = true;
      submit.textContent = "Sending…";
      status.textContent = "Submitting your request…";
      status.className = "lead-status";

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data
        });

        if (!response.ok) throw new Error("Formspree submission failed");

        form.reset();
        status.textContent = "Thanks! Your request was received. A home specialist will be in touch soon.";
        status.className = "lead-status success";
        status.focus({ preventScroll: true });
      } catch (error) {
        status.textContent = "We couldn’t send your request. Please try again in a moment.";
        status.className = "lead-status error";
      } finally {
        submit.disabled = false;
        submit.textContent = form.dataset.submitLabel || "Request my free estimate";
      }
    });
  });
})();
