(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()
let taxSwitch = document.querySelector("#flexSwitchCheckDefault");

if (taxSwitch) {
  taxSwitch.addEventListener("click", () => {
    let taxInfo = document.querySelectorAll(".tax-info");
    for (let info of taxInfo) {
      info.classList.toggle("hide");
    }
  });
}