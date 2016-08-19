$(document).ready(function(){
	var $bookList=$('#wholeTable');
	var $allBookList=$('#allBookList');
	var $Bookheading=$('#Bookheading').html();
	var template=$('#allBookList').html();
	var searchVal=null;
	var urlCondition="";
	var pageStart=0, 
		pageEnd=21;
	var checkSubmit="";
	/*Ajax GET event*/
	var ajaxGet=function(){
		$.ajax({
			type:"GET",
			url : 'http://localhost:8080/Books/'+urlCondition,
			success: function(result){
				pagination(result);
			},
			error: function(){
				alert("Invalid search");
			}
		});
	};
	/*Ajax POST event*/
	var ajaxPost=function(bookPost){
		$.ajax({
			type:"POST",
			url : 'http://localhost:8080/Books/'+posturlCondition,
			data: bookPost,
			success: function(result){
				alert("Successfully inserted data");
				$('#myModal').modal('toggle');
			},
			error: function(){
				alert("Error on inserting the data");
			}
		});
	};
	/*Ajax put event*/
	var ajaxPUT=function(bookPost){
		$.ajax({
			type:"PUT",
			url : 'http://localhost:8080/Books/'+posturlCondition,
			data: bookPost,
			success: function(result){
				alert("Successfully inserted data");
				$('#myModal').modal('toggle');
				$bookList.html("");
				ajaxGet();
			},
			error: function(){
				console.log("error");
				alert("Error on inserting the data");
			}
		});
	};	
	/*Load complete data*/
    $("#loadDetails").click(function(){
    	$bookList.html("");
    	searchVal==null;
    	pageStart=0;
    	urlCondition='?_start='+pageStart+'&_limit=51';
		ajaxGet();
	});
	/*Search*/
	$('#search').click(function(){
		$bookList.html("");
		searchVal=$('#searchtextbox').val();
    	pageStart=0;
    	urlCondition='?Book_name_like='+searchVal+'&_start='+pageStart+'&_limit=51';
		ajaxGet();
	});
	/*Add new book*/
	$('#inputForm').on('submit',function(e){
		e.preventDefault();
		if(checkSubmit=='Add'){
			addNewBook();
		}
		else if(checkSubmit=='Edit'){
			console.log("Right");
			editBook();
		}
		console.log(checkSubmit);
	});
	var addNewBook= function(){
		console.log("Inside add new");
		var $bookname=$('#bookname').val();
		var $authorname=$('#authorname').val();
		var $publishername=$('#publishername').val();
		var $type=$('input[name=type]:checked').val();//$('#type').val();
		var $genres=$('select[id=Genres]').val();//$('#Genres').val();
		var $publishedyear=$('#publishedyear').val();
		var $language=$('#language').val();
		var $price=$('#price').val();
		var bookPost={
    				"Book_name": $bookname,
    				"Author_name": $authorname,
    				"Publisher_name": $publishername,
    				"Type": $type,
    				"Genres": $genres,
    				"Language": $language,
    				"Book_cover": "http://placehold.it/32x32",
    				"Published_year": $publishedyear,
    				"Price": $price
  			};
  		posturlCondition="";
  		ajaxPost(bookPost);
	};
	var editBook=function(){
		console.log("Inside edit");
		console.log($('input[name=type]:checked').val());
		var $bookname=$('#bookname').val();
		var $authorname=$('#authorname').val();
		var $publishername=$('#publishername').val();
		var $type=$('input[name=type]:checked').val();//$('#type').val();
		var $genres=$('select[id=Genres]').val();//$('#Genres').val();
		var $publishedyear=$('#publishedyear').val();
		var $language=$('#language').val();
		var $price=$('#price').val();
		var bookPost={
    				"Book_name": $bookname,
    				"Author_name": $authorname,
    				"Publisher_name": $publishername,
    				"Type": $type,
    				"Genres": $genres,
    				"Language": $language,
    				"Book_cover": "http://placehold.it/32x32",
    				"Published_year": $publishedyear,
    				"Price": $price
  			};
  		ajaxPUT(bookPost);
	};
	// Value of modal window to empty
	$('#addBooks').click(function(){
		$('#bookname').val("");
		$('#authorname').val("");
		$('#publishername').val("");
		$('#fiction').prop('checked',false);
		$('#Genres').prop("disabled",true);
		$('#Genres').html("");
		//$('#Genres').val("");
		$('#publishedyear').val("");
		$('#language').val("");
		$('#price').val("");
		posturlCondition="";
		checkSubmit="Add";
		$('.editFooter').html('<button class="btn btn-primary" role="button" data-dismiss="modal">Cancel</button><button type="submit" class="btn btn-success" role="button" id="addBook">Add Book</button>');
	});
	var fictionGenres=['Scientific','Travel','Dictionary','Health'];
	var nonfictionGenres=['Comedy','Novel','Action','Drama'];
	//console($('#Genres').val());
	$('input:radio').click(function(){
		if($("input:checked").val() == "Fiction")
		{
			$('#Genres').prop("disabled",false);
    		//ajax call to php file and pass a parameter buyer
    		console.log("Fiction selected");
    		$('#Genres').html("");
    		for(var i=0;i<fictionGenres.length;i++)
            {
                var opt = new Option(fictionGenres[i]);
                opt.value=fictionGenres[i];
                $("#Genres").append(opt);
            }
		}
		else{
    		//ajax call to php file and pass a parameter merchant
    		console.log("non- Fiction selected");
    		$('#Genres').prop("disabled",false);
    		$('#Genres').html("");
    		for(var i=0;i<nonfictionGenres.length;i++)
            {
                var opt = new Option(nonfictionGenres[i]);
                opt.value=nonfictionGenres[i];
                $("#Genres").append(opt);
            }        
		}
	});

	/*Delete */
	$bookList.delegate('#deleteButton','click',function(){
		var id=$(this).attr('data-id');
		var tr=$(this).closest('tr');
		var check=confirm("Do you want to delete the data  ? ");
		if(check==true){
		$.ajax({
			type:"DELETE",
			url : 'http://localhost:8080/Books/'+id,
			success: function(result){
				alert("Data deleted successfully");
				tr.fadeOut(200,function(){
					$(this).remove();
				});
			},
			error: function(){
				alert("Oops.. Error on deleting the record.");
			}
		});	
		}
	});
	// Edit 
	$bookList.delegate('#editButton','click',function(){
		var id=$(this).attr('data-id');
		tr=$(this).closest('tr');
		posturlCondition=id;
		$.ajax({
			type:"GET",
			url : 'http://localhost:8080/Books/'+id,
			success: function(result){
    				$('#Genres').prop("disabled",false);
					$('#bookname').val(result.Book_name);
					$('#authorname').val(result.Author_name);
					$('#publishername').val(result.Publisher_name);
					if(result.Type=='Non-Fiction'){
						$('#Genres').html("");
						$('#nonfiction').prop('checked',true);
						var opt = new Option(result.Genres);
                		opt.value=result.Genres;
                		$("#Genres").append(opt);
                		for(var i=0;i<nonfictionGenres.length;i++)
            			{
            				if(result.Genres!=fictionGenres[i]){
                			var opt = new Option(nonfictionGenres[i]);
                			opt.value=nonfictionGenres[i];
                			$("#Genres").append(opt);
                			}
            			}
					}
					else{
						$('#fiction').prop('checked',true);
						$('#Genres').html('');
						var opt = new Option(result.Genres);
                		opt.value=result.Genres;
                		$("#Genres").append(opt);
                		for(var i=0;i<fictionGenres.length;i++)
            			{
            				if(result.Genres!=fictionGenres[i]){
                			var opt = new Option(fictionGenres[i]);
                			opt.value=fictionGenres[i];
                			$("#Genres").append(opt);
                			}
            			}
					}
					//$('#type').val(result.Type);
					//$('select[id=Genres]').val(result.Genres);
					//$('#Genres').val(result.Genres);
					$('#publishedyear').val(result.Published_year);
					$('#language').val(result.Language);
					$('#price').val(result.Price);
					checkSubmit="Edit";
					$('.editFooter').html('<button class="btn btn-primary" role="button" data-dismiss="modal">Cancel</button><button type="submit" class="btn btn-success" role="button" id="saveEdit">Save</button>')
				},
			error: function(){
				alert("Invalid search");
			}
		});
	});
	/*Hide both next and prev */
	$('.prevButton').hide();
	$('.nextButton').hide();
	/*Pagination*/
	/*Next button click*/
	$('.nextButton').click(function(){
		$bookList.html("");
		goNext();
	});
	/*Next function*/
	var goNext=function(){
		pageStart=pageStart+50;
		if(searchVal==null){
			urlCondition='?_start='+pageStart+'&_limit=51';
		}
		else{
			urlCondition='?Book_name_like='+searchVal+'&_start='+pageStart+'&_limit=51';
		}
		ajaxGet();
		$('.prevButton').show();
	}
	/*Prev button click*/
	$('.prevButton').click(function(){
		$bookList.html("");
		goPrevious();

	});
	/*Prev function*/
	var goPrevious=function(){
		pageStart=pageStart-50;
		if(searchVal==null){
			urlCondition='?_start='+pageStart+'&_limit=51';
		}
		else{
			urlCondition='?Book_name_like='+searchVal+'&_start='+pageStart+'&_limit=51';
		}
		ajaxGet();
		if(pageStart==0){
			$('.prevButton').hide();
		}
	}
	/*Pagination function*/
	var pagination=function(data){
				if(data.length!=0){
				if(data.length==51){
					$('.nextButton').show();
				}
				else{
					$('.nextButton').hide();
				}
				if(pageStart==0){
					$('.prevButton').hide();
				}
				$bookList.append(Mustache.render($Bookheading));
				var counter=0;
				$.each(data,function(i,book){
					$bookList.append(Mustache.render(template,book));
					counter++;
					if(counter==50){
						return false;
					}
				});
			}
			else{
				$bookList.append('<h1>No data</h1>');
			}
	}
});