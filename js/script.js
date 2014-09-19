
var stars_url = "";
var message = ('<p id="message">'+ "Click on the book image to get more info"+ '</p>');
var errormessage = '<p id="error1">' + "Hoops! There\'s been a network error" + "Pls try again later" +'</p>';
BookWizard = {
	base: "https://www.googleapis.com/books/v1/volumes",
	base1:"https://www.googleapis.com/books/v1/volumes?q=General",
	params:{q: "", orderBy: 'newest'},
	searchBookField: null,
	searchButton: null,
	bookResult: null,
	resultStatus: null,

	init: function(){
		BookWizard.searchBookField = $('#searchBookField');
		BookWizard.searchButton = $('#searchButton');
		BookWizard.bookResult = $('#bookResult');
		BookWizard.resultStatus = $('#resultStatus');
		BookWizard.initEvent();
	},	
	initEvent: function(){
		$.getJSON(BookWizard.base1,function(response){
			BookWizard.loadBooks(response);
			$('.bookPreview').append(message);
		});
		BookWizard.searchButton.click(BookWizard.onSearch);
		$(document).on("click",".photo", function(){
			var elems = $(this).next().text();
			 // console.log(elems);
			BookWizard.getMore(elems);
		});
	},
	getMore: function (elems) {		     
        $('.bookPreview').empty();
        $('.bookPreview').append('<img class="state1" src="img/loading.gif"/>');
		$.getJSON(BookWizard.base + '/' + elems, function(response){
			BookWizard.loadMore(response);
		}).fail(function(failure){
			$('.bookPreview').append("errormessage");
		});
			
      },
      loadMore: function(response){
      	if (response.totalItems < 1){
			$('.bookPreview').append('<h1>'+ "No Result Found" + '</h1>');
		}
      		var title = response.volumeInfo.title;
			var author = response.volumeInfo.authors;
			var category = response.volumeInfo.categories;
			var image_url = response.volumeInfo.imageLinks.thumbnail;
			var publisher = response.volumeInfo.publisher;
			var pageCount = response.volumeInfo.pageCount;
			var ratings = parseInt(response.volumeInfo.averageRating);
			var ratingsCount = response.volumeInfo.ratingsCount;
			var description = response.volumeInfo.description;
			var preview = response.accessInfo.webReaderLink;
			console.log(preview);
			var datePublished = response.volumeInfo.publishedDate;
			$('.ratings').hide();

			if (typeof ratings === 'undefined'){
				var ratings = "Not Available";
			}
			else if(Math.floor(ratings) === 5){				
				stars_url = "img/5star.png";
			}
			else if(Math.floor(ratings) === 4){
				stars_url = "img/4star.png";
			}
			else if(Math.floor(ratings) === 3){
				stars_url = "img/3star.png";
			}
			else if (Math.floor(ratings) === 2){
				stars_url = "img/2star.png"; 
			}
			else if (Math.floor(ratings) === 1){
				stars_url = "img/star_small.png";
			}
			if (typeof ratingsCount === 'undefined'){
				var ratingsCount = "No";
			}
		
			var postDiv = '<div class="post1">' + '<div class="title1">' + title +'</div>'+'<div id="pics1">' +
			'<img class="photo1" src="' + image_url + '" alt="image"/>'+'</div>' +'<div id="info1">'+ '<div class="author1">' + author +'</div>'+ '<div class="datePublished">'+ datePublished +'</div>'+'<div class="category">' + category +'</div>' +'<div class="pageCount">'+ pageCount + " Pages " +'</div>'+'<div class="ratings">' + ratings +'</div>' +'<img class="stars" src="'+ stars_url + '" />'+ '<div class="ratingsCount">' + ratingsCount + " reviews" + '</div>'+'</div>' + '<div class="description">' + description + '</div>' + '<a href="' + preview + '">' + "Preview this Book >>" + '</a>'+ 
			'</div>';
				$('.bookPreview').append(postDiv);
				$('.ratings').hide();	
				$('.state1').hide();
			
      },
	onSearch: function(evt){
		var srchField = BookWizard.searchBookField.val();
		BookWizard.searchBookField.prop("disabled", true);
		BookWizard.searchButton.attr("disabled", true);
		BookWizard.resultStatus.text("");	
		
		if(srchField){
				srchField = srchField.trim();
				if((srchField.length > 1)&&!/^\d/.test(srchField))
				{
					BookWizard.search(srchField);
					 return;
				}
				BookWizard.resultStatus.text('You made an invalid input');
			BookWizard.searchBookField.prop("disabled", false);
			BookWizard.searchButton.attr("disabled", false);
			}
			else{
				BookWizard.resultStatus.text('You made an invalid input');
				BookWizard.searchBookField.prop("disabled", false);
				BookWizard.searchButton.attr("disabled", false);
			}
		
		evt.preventDefault();
	},
	search: function(bookName){
		BookWizard.params.q = bookName;
		$('#bookResult').empty();
		$('#bookResult').append('<img class="state" src="img/loading.gif"/>');
		$.getJSON(BookWizard.base,BookWizard.params, function(response){
			BookWizard.loadBooks(response);
		}).fail(function(failure){
			$('#bookResult').append("errormessage");
		});
	},
	loadBooks: function(response){
		if (response.totalItems < 1){
			$('#bookResult').append('<div class="error">' + '<h1>'+ "No Result Found" + '</h1>' +'<img class="state2" src="img/ohno.gif"/>' + '</div>');
			$('.state').hide();
			BookWizard.searchBookField.prop("disabled", false);
			BookWizard.searchButton.attr("disabled", false);
		}

		$.each(response.items, function(){
			var title = this.volumeInfo.title;
			var author = this.volumeInfo.authors;
			var image_url = this.volumeInfo.imageLinks.thumbnail;
			var bookID = this.id;
			var postDiv = '<div class="post">' + 
			'<img class="photo" src="' + image_url + '" alt="image"/>' + '<div class = "bookId">' + bookID + '</div>'+'<div id="info">'+'<div class="title">' +"Title: " + title +'</div>'+ '<div class="author">' + "Author: " + author +'</div>' +'</div>' +
			'</div>';
			$('.state').hide();
			$('#bookResult').append(postDiv);
			BookWizard.searchBookField.prop("disabled", false);
			BookWizard.searchButton.attr("disabled", false);
		});
	}
	
}
$(document).ready(BookWizard.init);