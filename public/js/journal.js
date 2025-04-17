var btn = document.querySelector("#open-form");
const crtform = document.querySelector(".create-form");
const close = document.querySelector("#cancel");
const create = document.querySelector("#create");

btn.addEventListener("click", () => {
  crtform.classList.toggle("active");
});

close.addEventListener("click", () => {
  crtform.classList.remove("active");
});

// create.addEventListener("click", (e) => {
//   e.preventDefault();

//   const title = document.querySelector("#sp").value;
//   const entry = document.querySelector("#entry").value;

//   fetch("/journal/create", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ title, entry }),
//   })
//     .then((res) => res.json())
//     .then((result) => {
//       if (result === true) {
//         crtform.classList.remove("active");
//         document.querySelector("#title").value = "";
//         document.querySelector("#entry").value = "";
//       } else {
//         alert("Something went wrong try again!!");
//       }
//     })
//     .catch((err) => console.error("Error:", err));
// });

const del = document.querySelectorAll(".delete").forEach((btn) => {
  btn.addEventListener("click", () => {
    const delid = btn.getAttribute("data-id");
    const confirmDelete = confirm(
      "Are you sure you want to delete this entry?"
    );
    if (confirmDelete) {
      document.getElementById("del-id").value = delid;
      document.getElementById("delete-form").submit();
    }
  });
});
