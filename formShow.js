document.getElementById("8").addEventListener("click", showForm);
document.getElementById("7").addEventListener("click", showForm);
document.getElementById("6").addEventListener("click", showForm);
document.getElementById("5").addEventListener("click", showForm);

function showForm() {
    let staffNotes = document.getElementById("rpt0" + this.id)
    staffNotes.style.display === "none" ?
        staffNotes.style.display = "block" :
        staffNotes.style.display = "none"
}