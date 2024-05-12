export function load(selector, path) {
    const cached = localStorage.getItem(path);

    if (cached) {
        document.querySelector(selector).innerHTML = cached;
    }
    console.log("123");
    fetch(path)
        .then((res) => {
            return res.text();
        })

        .then((html) => {
            if (html !== cached) {
                console.log(html);
                document.querySelector(selector).innerHTML = html;
                localStorage.setItem(path, html);
            }
        });
}
