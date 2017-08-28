const baseUrl = `https://galvainze-reads.herokuapp.com/`
const localUrl = `http://localhost:8080/`


$(document).ready(function() {

  displayBooks();

  $(`#bookPage`).click(() => {
    $('.container').empty();
      displayBooks()
  })

  $(`#authorPage`).click(() => {
    displayAuthors();
  })
})

function displayBooks() {
  $.get(baseUrl + `books/all`, (data) => {
    $.get(baseUrl + 'authors/all',(data2) => {

      let newAuthorList = [];

      data2.map(function(obj2){
        newAuthorList.push(`<a id="${obj2.id}" class="selectAuthors collection-item">${obj2.first_name} ${obj2.last_name}</a>`);
      })

      $('.container').prepend(`<h1>Book</h1>
                              <a href="#newBook" class="btn-floating btn-large page-button waves-effect modal-trigger waves-light right red"><i class="material-icons">add</i></a>
                              <div class="carousel"></div>`)
      $('.container').append(`<div id="newBook" class="modal modal-fixed-footer">
                                <div class="modal-content">
                                  <h4>Add</h4>
                                  <form id="addBookForm" role="form">
                                    <div class="input-field">
                                      <input placeholder="Title" id="newTitle" value="" type="text" required="" aria-required="true" class="validate">
                                      <label class="active" for="newTitle" data-error="wrong" data-success="right">Title</label>
                                    </div>
                                    <div class="input-field">
                                      <input placeholder="Genre" id="newGenre" value="" type="text" required="" aria-required="true" class="validate">
                                      <label class="active" for="newGenre" data-error="wrong" data-success="right">Genre</label>
                                    </div>
                                    <div class="input-field">
                                      <input placeholder="http://example.com/handsomejack.jpg" id="newBookCover" value="" type="text" required="" aria-required="true" class="validate">
                                      <label class="active" for="newBookCover" data-error="wrong" data-success="right">URL for profile picture</label>
                                    </div>
                                    <div class="input-field">
                                      <textarea placeholder="Please enter the description of the book" id="newBookDescription" type="text" required="" aria-required="true" class="validate materialize-textarea"></textarea>
                                      <label class="active" for="newBookDescription" data-error="wrong" data-success="right">Description</label>
                                    </div>
                                  </div>
                                 </form>
                                <div class="modal-footer">
                                  <button id="addButton" type="submit" form="addBookForm" class="modal-action waves-effect waves-green btn-flat ">Add</a>
                                </div>
                              </div>`)

      $(`form#addBookForm`).submit(function(event) {
        event.preventDefault();
        $.post(`${baseUrl}books/new`,
        {
          title: $("#newTitle").val(),
          genre: $("#newGenre").val(),
          description: $("#newBookDescription").val(),
          url: $("#newBookCover").val()
        })
        .done(function() {
          $('.container').empty();
          displayBooks();
        })
      })

      for (var i = 0; i < data.length; i++) {
        var names = data[i].author.map(auth => auth.first_name + " " + auth.last_name)

        let authorAllList = [];
        let authorSelectList = [];
        let authorsOfBook = [];

        data2.map(function(obj){
          authorAllList.push(obj.first_name + " " + obj.last_name);
        })

        data[i].author.map(function(obj){
          data2.map(function(obj2){
            if(obj2.first_name + obj2.last_name == obj.first_name + obj.last_name){
              authorSelectList.push(obj2.first_name + " " + obj2.last_name);
            }
          })
        })

        authorAllList = authorAllList.filter(function(val) {
          return authorSelectList.indexOf(val) == -1;
        });

        authorSelectList.map(function(obj){
          data2.map(function(obj2){
            if(obj2.first_name + " " + obj2.last_name == obj){
              authorsOfBook.push(`<a id="${obj2.id}" class="selectAuthors collection-item active">${obj2.first_name} ${obj2.last_name}</a>`);
            }
          })
        })

        authorAllList.map(function(obj){
          data2.map(function(obj2){
            if(obj2.first_name + " " + obj2.last_name == obj){
              authorsOfBook.push(`<a id="${obj2.id}" class="selectAuthors collection-item">${obj2.first_name} ${obj2.last_name}</a>`);
            }
          })
        })

        $('.carousel').append(`<a href="#bookModal${i+1}" class="carousel-item modal-trigger"><img src="${data[i].url}"></a>`)
        $('.carousel').after(`<div id="bookModal${i+1}" class="modal modal-fixed-footer">
          <div class="modal-content">
            <h5 class="title-modal">Title</h5>
            <p>${data[i].title}</p>
            <h5 class="title-modal">Genre</h5>
            <p>${data[i].genre}</p>
            <h5 class="title-modal">Author(s)</h5>
            <p class="">${names.join(", ")}</p>
            <h5 class="title-modal">Description</h5>
            <p class="">${data[i].description}</p>
          </div>
          <div class="modal-footer">
            <a href="#deleteBook-${i}" class="modal-action modal-close waves-effect waves-green left btn-flat ">Delete</a>
            <a href="#editBook-${i}" href="#!" class="modal-action modal-close modal-trigger waves-effect waves-green btn-flat ">Edit</a>
            <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat ">Close</a>
          </div>
        </div>

        <div id="editBook-${i}" class="modal modal-fixed-footer">
          <div class="modal-content">
            <h4>Edit</h4>
            <form id="editBookForm${i}" role="form">
              <div class="input-field">
                <input id="book_title" value="${data[i].title}" type="text" class="validate">
                <label class="active" for="book_title">Book Title</label>
              </div>
              <div class="input-field">
                <input id="book_genre" value="${data[i].genre}" type="text" class="validate">
                <label class="active" for="book_genre">Book Genre</label>
              </div>
              <div class="input-field">
                <input id="bookCover" value="${data[i].url}" type="text" class="validate">
                <label class="active" for="bookCover" data-error="wrong" data-success="right">URL for Cover Picture</label>
              </div>
              <div class="input-field">
                <textarea id="book_description" type="text" class="validate materialize-textarea">${data[i].description}</textarea>
                <label class="active" for="book_description">Book Description</label>
              </div>
              <div class="collection authorSelection${i}">
                ${authorsOfBook.join("").toString()}
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="submit" href="#editBook" form="editBookForm${i}" href="#!" class="modal-action modal-close waves-effect waves-green btn-flat ">Edit</a>
          </div>
        </div>`)

        $('select').material_select();

        let bookId = data[i].id;

        $(`form#editBookForm${i}`).submit(function(event) {
          event.preventDefault();

          let books2 = [];
          let numbers = [];


          numbers = $(`.authorSelection${($(this).attr('id')).slice(-1)}`).find(`.active`).map(function(){return $(this).attr('id')}).get();

          numbers.map(function(arr){
            books2.push({"book_id": bookId, "author_id": parseInt(arr)});
          })

          $.ajax({
            url:`${baseUrl}books/${bookId}/edit`,
            type:"PUT",
            dataType:"json",
            data: {
              title: $(this).parent().before().find(`#book_title`).val(),
              genre: $(this).parent().before().find(`#book_genre`).val(),
              description: $(this).parent().before().find(`#book_description`).val(),
              url: $(this).parent().before().find(`#authorPicture`).val()
            }
          })
          .done(function(){
            $.ajax({
              url:`${baseUrl}books/${bookId}/editAuthors`,
              type:"POST",
              contentType: 'application/json',
              data: JSON.stringify(books2),
              complete: function () {
                $('.container').empty();
                displayBooks();
              }
            })
          })
        })

        $(`a[href="#deleteBook-${i}"]`).click(function(){
          $.ajax({
            url:`${baseUrl}books/${bookId}`,
            type: 'DELETE'
          })
          // location.href = '/';
        });
      }

      $(`#addButton`).click(function() {
        $(`#addButton`).addClass('modal-close')
      });

      $('.selectAuthors').click(function(){

        if (!$(this).hasClass('active')) {
              $(this).addClass('active');
        } else (
          $(this).removeClass('active')
        )
      })

      $('.carousel').carousel();
      $('.modal').modal();

  })
 })
}

function displayAuthors() {

  $.get(baseUrl + 'authors/all', (data) => {


    $.get(baseUrl + 'books/all',(data2) => {

  $('.container').empty();
  $('.container').prepend(`<div class="header-container">
                            <h2 class="page-title">Author</h2>
                            <a href="#newAuthor" class="btn-floating btn-large page-button waves-effect modal-trigger waves-light right red"><i class="material-icons">add</i></a>
                          </div>
                          <div class="carousel"></div>`)

  $('.container').append(`<div id="newAuthor" class="modal modal-fixed-footer">
    <div class="modal-content">
      <h4>Add</h4>
      <form id="addAuthorForm" role="form">
        <div class="input-field">
          <input placeholder="Frist Name" id="newFirstName" value="" type="text" required="" aria-required="true" class="validate">
          <label class="active" for="newFirstName" data-error="wrong" data-success="right">Author Name</label>
        </div>
        <div class="input-field">
          <input placeholder="Last Name" id="newLastName" value="" type="text" required="" aria-required="true" class="validate">
          <label class="active" for="newLastName" data-error="wrong" data-success="right">Author Name</label>
        </div>
        <div class="input-field">
          <select id="newBookSelect" multiple>
            <option value="" disabled selected>Choose your option</option>

          </select>
        </div>
        <div class="input-field">
          <input placeholder="http://example.com/handsomejack.jpg" id="newAuthPicture" value="" type="text" required="" aria-required="true" class="validate">
          <label class="active" for="newAuthPicture" data-error="wrong" data-success="right">URL for profile picture</label>
        </div>
        <div class="input-field">
          <textarea placeholder="Please enter the story of author" id="newAuthorBio" type="text" required="" aria-required="true" class="validate materialize-textarea"></textarea>
          <label class="active" for="newAuthorBio" data-error="wrong" data-success="right">Biography</label>
        </div>
      </div>
     </form>
    <div class="modal-footer">
      <button id="addButton" type="submit" form="addAuthorForm" class="modal-action waves-effect waves-green btn-flat ">Add</a>
    </div>
  </div>`)

  addAuthor();

    for (var i = 0; i < data.length; i++) {
      var titles = data[i].books.map(book => book.title)

      let bookAllList = [];
      let bookSelectList = [];
      let BooksOfAuthor = [];

      data2.map(function(obj){
        bookAllList.push(obj.title);
      })

      data[i].books.map(function(obj){
        data2.map(function(obj2){
          if(obj2.title == obj.title){
            bookSelectList.push(obj2.title);
          }
        })
      })

      bookAllList = bookAllList.filter(function(val) {
        return bookSelectList.indexOf(val) == -1;
      });

      bookSelectList.map(function(obj){
        data2.map(function(obj2){
          if(obj2.title == obj){
            BooksOfAuthor.push(`<a id="${obj2.id}" class="selectBooks collection-item active">${obj2.title}</a>`);
          }
        })
      })

      bookAllList.map(function(obj){
        data2.map(function(obj2){
          if(obj2.title == obj){
            BooksOfAuthor.push(`<a id="${obj2.id}" class="selectBooks collection-item">${obj2.title}</a>`);
          }
        })
      })


      $('.carousel').append(`<a href="#authorModal${i+1}" class="carousel-item modal-trigger"><img src="${data[i].url}"></a>`)
      $('.carousel').after(`<div id="authorModal${i+1}" class="modal modal-fixed-footer">
        <div class="modal-content">
          <h5 class="title-modal">Name</h5>
          <p class="">${data[i].first_name} ${data[i].last_name}</p>
          <h5 class="title-modal">Book(s)</h5>
          <p class="">${titles.join("<br>")}</p>
          <h5 class="title-modal">Biography</h5>
          <p class="">${data[i].biography}</p>
        </div>
        <div class="modal-footer">
          <a href="#deleteAuthor-${i}" class="modal-action modal-close waves-effect waves-green left btn-flat ">Delete</a>
          <a href="#editAuthor-${i}" href="#!" class="modal-action modal-close modal-trigger waves-effect waves-green btn-flat ">Edit</a>
          <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat ">Close</a>
        </div>
      </div>

      <div id="editAuthor-${i}" class="modal modal-fixed-footer">
        <div class="modal-content">
          <h4>Edit</h4>
          <form id="editAuthorForm${i}" role="form">
            <div class="input-field">
              <input id="author_first_name" value="${data[i].first_name}" type="text" class="validate">
              <label class="active" for="author_first_name" data-error="wrong" data-success="right">First Name</label>
            </div>
            <div class="input-field">
              <input id="author_last_name" value="${data[i].last_name}" type="text" class="validate">
              <label class="active" for="author_last_name" data-error="wrong" data-success="right">Last Name</label>
            </div>
            <div class="input-field">
              <input id="authorPicture" value="${data[i].url}" type="text" class="validate">
              <label class="active" for="authorPicture" data-error="wrong" data-success="right">URL for Profile Picture</label>
            </div>
            <div class="input-field">
              <textarea id="author-biography" type="text" class="validate materialize-textarea">${data[i].biography}</textarea>
              <label class="active" for="author-biography" data-error="wrong" data-success="right">Biography</label>
            </div>
            <div class="collection bookSelection${i}">
              ${BooksOfAuthor.join("").toString()}
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="submit" form="editAuthorForm${i}" class="modal-action modal-close waves-effect waves-green btn-flat">Done</a>
        </div>
      </div>`)
      $('#bookSelect').material_select();

      let authorId = data[i].id;

      $(`form#editAuthorForm${i}`).submit(function(event) {
        event.preventDefault();

        let books2 = [];
        let numbers = [];

        numbers = $(`.bookSelection${($(this).attr('id')).slice(-1)}`).find(`.active`).map(function(){return $(this).attr('id')}).get();

        numbers.map(function(arr){
          books2.push({"book_id": parseInt(arr), "author_id": authorId});
        })

        $.ajax({
          url:`${baseUrl}authors/${authorId}/edit`,
          type:"PUT",
          dataType: "json",
          data: {
            first_name: $(this).parent().before().find(`#author_first_name`).val(),
            last_name: $(this).parent().before().find(`#author_last_name`).val(),
            biography: $(this).parent().before().find(`#author-biography`).val(),
            url: $(this).parent().before().find(`#authorPicture`).val()
          }
        })
        .done(function () {
          $.ajax({
            url:`${baseUrl}authors/${authorId}/editBooks`,
            type:"POST",
            contentType: 'application/json',
            data: JSON.stringify(books2)
          })
          displayAuthors();
        })
      })

      $(`a[href="#deleteAuthor-${i}"]`).click(function(){
        $(`a[href="#authorModal${i+1}"]`).fadeOut();

        $.ajax({
          url:`${baseUrl}authors/${authorId}`,
          type: 'DELETE'
        })
          .done(function(){
            displayAuthors();
          })
      });
    }

    $('.selectBooks').click(function(){

      if (!$(this).hasClass('active')) {
            $(this).addClass('active');
      } else (
        $(this).removeClass('active')
      )
    })

    $(`#addButton`).click(function() {
      $(`#addButton`).addClass('modal-close')
    });

    $('.carousel').carousel();
    $('.modal').modal();
    })
  });
}

function addAuthor() {
  $(`form#addAuthorForm`).submit(function(event) {
    event.preventDefault();

    $.post(`${baseUrl}authors/new`,
    {
      first_name: $("#newFirstName").val(),
      last_name: $("#newLastName").val(),
      biography: $("#newAuthorBio").val(),
      url: $("#newAuthPicture").val()
    })
      .done(function(){
        displayAuthors();
      })
  })
}
