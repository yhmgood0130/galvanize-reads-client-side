const baseUrl = `https://galvainze-reads.herokuapp.com/`
const localUrl = `http://localhost:8080/`


$(document).ready(function() {

    displayBooks()

  $(`#bookPage`).click(() => {
    $('.container').empty();
      displayBooks()

  })

  $(`#authorPage`).click(() => {
    displayAuthors();
  })
})

function displayBooks() {
  $.get( localUrl + `books/all`, (data) => {
  let authorList = [];
  for (var j = 0; j < data.length; j++) {
    for (var k = 0; k < data[j].author.length; k++) {
      authorList.push(`<option>${data[j].author[k].first_name} ${data[j].author[k].last_name}</option>`);
    }
  }

  let authorArray = authorList.filter(function(elem, pos) {
    return authorList.indexOf(elem) == pos;
  });

  authorArray = authorArray.toString();

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
                                  <select multiple>
                                    <option value="" disabled selected>Choose your option</option>
                                      ${authorArray}
                                  </select>
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

  for (var i = 0; i < data.length; i++) {
    var names = data[i].author.map(auth => auth.first_name + " " + auth.last_name)
    $('.carousel').append(`<a href="#bookModal${i+1}" class="carousel-item modal-trigger"><img src="${data[i].url}"></a>`)
    $('.carousel').after(`<div id="bookModal${i+1}" class="modal modal-fixed-footer">
      <div class="modal-content">
        <h4>Info</h4>
        <p class="red-text">${data[i].title}</p>
        <p class="red-text">${data[i].genre}</p>
        <p class="red-text">${names.join("<br>")}</p>
        <p class="red-text">${data[i].description}</p>
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
            <select multiple>
              <option value="" disabled selected>Choose your option</option>
              ${authorArray}
            </select>
          </div>
          <div class="input-field">
            <textarea id="book_description" type="text" class="validate materialize-textarea">${data[i].description}</textarea>
            <label class="active" for="book_description">Book Description</label>
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


      let books = []
      $(this).parent().before().find(`li.active`).each( function( index, element ){
          books.push($(this).text());
      });

      $.ajax({
        url:`${localUrl}books/${bookId}/edit`,
        type:"PUT",
        dataType:"json",
        data: {
          title: $(this).parent().before().find(`#book_title`).val(),
          genre: $(this).parent().before().find(`#book_genre`).val(),
          description: $(this).parent().before().find(`#book_description`).val(),
          url: $(this).parent().before().find(`#authorPicture`).val()
        },
        complete: function () {
          $('.container').empty();
          displayBooks(data);
        }
      })
    })

    $(`form#addBookForm`).submit(function(event) {
      event.preventDefault();

      let author = []
      $(this).parent().before().find(`li.active`).each( function( index, element ){
          author.push($(this).text());
      });

        $.post(`${localUrl}books/new`,
        {
          title: $("#newTitle").val(),
          genre: $("#newGenre").val(),
          description: $("#newBookDescription").val(),
          url: $("#newBookCover").val()
        })
          .done(function(){
            $('.container').empty();
            displayBooks(data);
          })
    })

    $(`#addButton`).click(function() {
      $(`#addButton`).addClass('modal-close')
    });

    $(`a[href="#deleteBook-${i}"]`).click(function(){
      $(`a[href="#bookModal${i+1}"]`).fadeOut();

      $.ajax({
        url:`${localUrl}books/${bookId}`,
        type: 'DELETE'
      })
        .done(function(){
          displayBooks(data);
        })
    });
  }

  $(`#addButton`).click(function() {
    $(`#addButton`).addClass('modal-close')
  });

    $(`a[href="#deleteBook-${i}"]`).click(function(){
      $(`a[href="#bookModal${i+1}"]`).fadeOut();
    });

  $('.carousel').carousel();
  $('.modal').modal();
 })
}

function displayAuthors() {

  $.get(localUrl + 'authors/all', (data) => {


    $.get(localUrl + 'books/all',(data2) => {

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
          <h4>Info</h4>
          <p class="red-text">NAME <br><br> ${data[i].first_name} ${data[i].last_name}</p>
          <p class="red-text">TITLE <br><br> ${titles.join("<br>")}</p>
          <p class="red-text">Biography <br><br>${data[i].biography}</p>
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
        $(this).parent().before().find(`li.active`).each( function( index, element ){
            books.push($(this).text());
        });

        numbers = $(`.bookSelection${($(this).attr('id')).slice(-1)}`).find(`.active`).map(function(){return $(this).attr('id')}).get();

        console.log(numbers);

        numbers.map(function(arr){
          books2.push({"book_id": parseInt(arr), "author_id": authorId});
        })

        console.log(books2);

        // dataType:"json",

        $.ajax({
          url:`${localUrl}authors/${authorId}/edit`,
          type:"PUT",
          dataType: "json",
          data: {
            first_name: $(this).parent().before().find(`#author_first_name`).val(),
            last_name: $(this).parent().before().find(`#author_last_name`).val(),
            biography: $(this).parent().before().find(`#author-biography`).val(),
            url: $(this).parent().before().find(`#authorPicture`).val()
          },
          complete: function () {
            $.ajax({
              url:`${localUrl}authors/${authorId}/editBooks`,
              type:"POST",
              contentType: 'application/json',
		          data: JSON.stringify(books2),
              complete: function () {
                displayAuthors();
              }
            })
          }
        })
      })

      $(`a[href="#deleteAuthor-${i}"]`).click(function(){
        $(`a[href="#authorModal${i+1}"]`).fadeOut();

        $.ajax({
          url:`${localUrl}authors/${authorId}`,
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

    $(`form#addAuthorForm`).submit(function(event) {
      event.preventDefault();

      let books = []
      $(this).parent().before().find(`li.active`).each( function( index, element ){
          books.push($(this).text());
      });

      $.post(`${localUrl}authors/new`,
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

    $(`#addButton`).click(function() {
      $(`#addButton`).addClass('modal-close')
    });

    $('.carousel').carousel();
    $('.modal').modal();
    })
  });
}
