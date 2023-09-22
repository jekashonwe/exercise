//Constructor
function Book(name, author, type) {
    this.name = name;
    this.author = author;
    this.type = type;
}

// Display Constructor
function Display() {

}

// Add methods to display prototype
Display.prototype.add = function (book) {
    console.log("Adding to UI");
    tableBody = document.getElementById('tableBody');
    let uiString = `<tr>
                        <td>${book.name}</td>
                        <td>${book.author}</td>
                        <td>${book.type}</td>
                    </tr>`;
    tableBody.innerHTML += uiString;
}

// Implement the clear function
Display.prototype.clear = function () {
    let libraryForm = document.getElementById('libraryForm');
    libraryForm.reset();
}

// Implement the validate function
Display.prototype.validate = function (book) {
    if (book.name.length < 2 || book.author.length < 2) {
        return false
    }
    else {
        return true;
    }
}
Display.prototype.show = function (type, displayMessage) {
    let message = document.getElementById('message');
    message.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                            <strong>Message:</strong> ${displayMessage}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">×</span>
                            </button>
                        </div>`;
    setTimeout(function () {
        message.innerHTML = ''
    }, 2000);

}
// Add submit event listener to libraryForm
let libraryFormfill = document.getElementById('libraryForm');
libraryFormfill.addEventListener('submit', libraryFormSubmit);

function libraryFormSubmit(e) {
    console.log('YOu have submitted library form');
    let name = document.getElementById('bookName').value;
    let author = document.getElementById('author').value;
    let type;
    let fiction = document.getElementById('fiction');
    let programming = document.getElementById('programming');
    let cooking = document.getElementById('cooking');

    if (fiction.checked) {
        type = fiction.value;
    }
    else if (programming.checked) {
        type = programming.value;
    }
    else if (cooking.checked) {
        type = cooking.value;
    }

    let book = new Book(name, author, type);
    console.log(book);

    let display = new Display();

    if (display.validate(book)) {

        display.add(book);
        display.clear();
        display.show('success', 'Your book has been successfully added')
    }
    else {
        // Show error to the user
        display.show('danger', 'Sorry you cannot add this book');
    }

    e.preventDefault();
}
// codes
const setTableValues = (dataSet) => {
    $(document).ready(function () {
        $('#example').DataTable({
            destroy: true,
            data: dataSet,
            columns: [
                { title: 'Book Name' },
                { title: 'Author' },
                { title: 'Published Year' },
                { title: 'Cover' },
            ],
        });
    });
}

setTableValues([]);
let booksData = [];
let newBooksData = [];
let isLoading = true;
const defaultImage = '<img class="cover-image" src="https://i.pinimg.com/736x/83/10/fa/8310fac88fd674985fa06e892e1f8f29--bound-book-bookbinding.jpg"/>'
function getbooks(){
    // Fetch data from the Open Library API using the search query entered by the user
    document.getElementById('loader').style.display = 'block';
    fetch("https://openlibrary.org/search.json?q=sports")
    // Convert the response to JSON format
    .then(a=>a.json())

    // Process the JSON data and add book details to a Bootstrap table
    .then(response=>{
        document.getElementById('loader').style.display = 'none';
        let fetchedBooks=[];
        response.docs.map((data)=>{
            const {author_name,title,publish_year,isbn} = data;
            if(author_name && title && publish_year && isbn){
                fetchedBooks.push([title, author_name[0] || "--", publish_year[0] || "--",
                isbn[0] ? 
                `<img class="cover-image" src=${"https://covers.openlibrary.org/b/isbn/" + isbn[0] + "-M.jpg"} 
                title=${title}/>` : defaultImage
            ])
            }
            })
        booksData=fetchedBooks;
        const totalBooks = [...newBooksData,...booksData];
        document.getElementById("books-count").innerHTML=totalBooks.length;
        setTableValues(totalBooks);
    }).catch(error=>{
        document.getElementById('loader').style.display = 'none';
        console.log('error',error)
    });
}





