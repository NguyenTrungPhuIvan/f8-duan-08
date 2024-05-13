export function switchThemes() {
    const checkBoxSwitch = document.querySelector(".checkbox-themes");
    const checkBoxBtn = document.querySelector(".checkbox-btn");
    console.log(checkBoxBtn);
    const htmlClass = document.querySelector("html");

    checkBoxBtn.onclick = () => {
        if (checkBoxSwitch.checked) {
            htmlClass.classList.add("dark");
        } else {
            htmlClass.classList.remove("dark");
        }
    };
}
