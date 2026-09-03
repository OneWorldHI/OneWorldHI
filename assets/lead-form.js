(() => {
  const CRM_ENDPOINT = "https://script.google.com/macros/s/AKfycbxLzs0f5ukznbfnZmgNJAEdwbfyfjaj58OfdQdTUUZuGawtNMjGr4qiX8RU8Ralgwv9kg/exec";

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

      const payload = {
        timestamp: new Date().toISOString(),
        leadId: "OW-LEAD-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        firstName: String(data.get("firstName") || "").trim(),
        lastName: String(data.get("lastName") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        email: String(data.get("email") || "").trim(),
        zip: String(data.get("zip") || "").trim(),
        timeline: String(data.get("timeline") || "").trim(),
        service: String(data.get("service") || "").trim(),
        projectDetails: String(data.get("projectDetails") || "").trim(),
        symptoms: String(data.get("projectDetails") || "").trim(),
        heardFrom: "One World website",
        waterSource: "",
        pageUrl: window.location.href,
        form: "One World Service Lead Gen"
      };

      if (!/^\d{5}(-\d{4})?$/.test(payload.zip)) {
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
        await fetch(CRM_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          body: JSON.stringify(payload)
        });
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
