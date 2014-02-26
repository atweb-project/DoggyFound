//Phonegap Script 
var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var fullsourcepath;
var db;
var pushNotification;
var watchID = null;



document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("online", onOnline, false);
document.addEventListener("offline", onOffline, false);

// device APIs are available
//
function onDeviceReady() {
    // alert('device ready');
	
   // Database call
    var db = window.openDatabase("AppDatabase", "1.0", "User", 10485760);
    db.transaction(populateDB, errorCB, successCB);
	// Backbutton call
    document.addEventListener("backbutton", onBackKeyDown, false);
    // Camera Globals
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
    
    try 
    { 
    pushNotification = window.plugins.pushNotification;
    
    if (device.platform == 'android' || device.platform == 'Android') {
        //$("#app-status-ul").append('<li>registering android</li>');
    	console.log("registering android");
        pushNotification.register(successHandler, errorHandler, {"senderID":"955675278537","ecb":"onNotificationGCM"});                // required!
    	} else {
        $("#app-status-ul").append('<li>registering iOS</li>');
        pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});        // required!
    	}
	}
	catch(err) 
	{ 
		txt="There was an error on this page.\n\n"; 
		txt+="Error description: " + err.message + "\n\n"; 
		alert(txt); 
	} 
}

function onOnline() {
    console.log("onOnline");
    setInterval(function(){onlineUser()},60000);
}

function onOffline() {
    console.log("onOffline");
    alert('You are offline, please check your connection');
}

// handle APNS notifications for iOS
function onNotificationAPN(e) {
if (e.alert) {
$("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
navigator.notification.alert(e.alert);
}

if (e.sound) {
var snd = new Media(e.sound);
snd.play();
}

if (e.badge) {
pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
}
}

// handle GCM notifications for Android
function onNotificationGCM(e) {
//$("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');
	console.log('EVENT -> RECEIVED:' + e.event);

switch( e.event )
{
case 'registered':
if ( e.regid.length > 0 )
{
       // alert('REGISTERED -> REGID:' + e.regid );
	
        // Your GCM push server needs to know the regID before it can push to
		// this device
        // here is where you might want to send it the regID for later use.
        console.log("regID = " + e.regid);
        
        document.getElementById('jform_regidgcm').value = e.regid;
        
        //saveRegIdGCM();
        
       /* function saveRegIdGCM() {
      	  var db = window.openDatabase("AppDatabase", "1.0", "Regid", 10485760);
      	    db.transaction(function(tx){
      	    tx.executeSql('INSERT INTO REGID(regID) VALUES (?)',[e.regid]);}, Datasavedsuccess);
      }*/

        /*function saveRegIdGCMsuccess(tx, results) {
      	 if (results.rows.length != 0) {
      		 var email;
      		 var regID = e.regid;
      		 for(var i=0; i<results.rows.length; i++) {
      			 console.log("Email="+results.rows.item(i).email); 
      			 email = results.rows.item(i).email;
      			 $.ajax({url: 'http://www.doggyfound.com/dfapp/notifications/regIDGCM.php',
      	                data: {"jform[email] ="+ email,"jform[regidgcm] ="+ regID},
      	                type: 'post',                   
      	                async: true,
      	                crossDomain:true,
      	                success: function (result) {
      	                          
      	                  },
      	                  error: function (request,error) {
      	                        // This callback function will trigger on
      							// unsuccessful action
      	                        alert('Network error has occurred please try again!');
      	                    }
      	                });            
      			}		 
      	 }
      }*/
}
break;

case 'message':
// if this flag is set, this notification happened while we were in the
// foreground.
// you might want to play a sound to get the user's attention, throw up a
// dialog, etc.
if (e.foreground)
{
               // $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');
                
                // if the notification contains a soundname, play it.
                var my_media = new Media("/android_asset/www/"+e.soundname);
                my_media.play();
        }
        else
        {        // otherwise we were launched because the user touched a
					// notification in the notification tray.
                if (e.coldstart)
                       // $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                		console.log("COLDSTART NOTIFICATION");
                else
                //$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                	console.log("BACKGROUND NOTIFICATION");
        }
		
navigator.notification.alert(e.payload.message);
                
       // $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
       // $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
break;

case 'error':
        //$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
			console.log('ERROR -> MSG:' + e.msg);
break;

default:
       // $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
			console.log('EVENT -> Unknown, an event was received and we do not know what it is');
break;
}
}

function tokenHandler (result) {
//$("#app-status-ul").append('<li>token: '+ result +'</li>');
	console.log('token: '+ result);
// Your iOS push server needs to know the token before it can push to this
// device
// here is where you might want to send it the token for later use.
}

function successHandler (result) {
//$("#app-status-ul").append('<li>success:'+ result +'</li>');
	console.log('success:'+ result);
}

function errorHandler (error) {
//$("#app-status-ul").append('<li>error:'+ error +'</li>');
	console.log('error:'+ error);
}
    
// Populate the database
//
function populateDB(tx) {
    // tx.executeSql('DROP TABLE IF EXISTS USER');
    tx.executeSql('CREATE TABLE IF NOT EXISTS USER (id INTEGER PRIMARY KEY, name, breed, gender, photoupload, specialdetails, microchipcode, username, password, email, phonenumber, country, city, address)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS REGID (id INTEGER PRIMARY KEY, regId)');
}

// Transaction error callback
//
function errorCB(err) {
    alert("Error processing SQL: "+err);
}

// Transaction success callback
//
function successCB() {
    var db = window.openDatabase("AppDatabase", "1.0", "User", 10485760);
    db.transaction(queryDB, errorCB);
}

function Datasavedsuccess() {
    alert("success!");
}

function saveUserData(){
 // Database call
   var db = window.openDatabase("AppDatabase", "1.0", "User", 10485760);
    db.transaction(function(tx){
	tx.executeSql('INSERT INTO USER(name, breed, gender, photoupload, specialdetails, microchipcode, username, password, email, phonenumber, country, city, address) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',[$('#name').val(), $('#breed').val(), $('#gender').val(), $('#photoname').val(), $('#specialsdetails').val(), $('#microchipcode').val(), $('#username').val(), $('#password').val(), $('#email').val(), $('#phonenumber').val(), $('#country').val(), $('#city').val(), $('#address').val()]);}, Datasavedsuccess);
}

function updateUserData(){
	var db = window.openDatabase("AppDatabase", "1.0", "User", 10485760);
	db.transaction(function(tx){
		tx.executeSql('UPDATE USER SET name=?, breed=?, gender=?, photoupload=?, specialdetails=?, microchipcode=?, username=?, password=?, email=?, phonenumber=?, country=?, city=?, address=? WHERE id=1 ',[$('.name').val(), $('.breed').val(), $('.gender').val(), $('.photoname').val(), $('.specialsdetails').val(), $('.microchipcode').val(), $('.username').val(), $('.password').val(), $('.email').val(), $('.phonenumber').val(), $('.country').val(), $('.city').val(), $('.address').val()]);}, Datasavedsuccess);
	}


 function queryDB(tx) {
 
    tx.executeSql('SELECT name,photoupload,username,password,email FROM USER', [], querySuccess, errorCB);
    
    }

function querySuccess(tx, results) {
	 if (results.rows.length != 0) {
		$.mobile.changePage("home.html",{
        		transition: "none", reverse: true, changeHash: true });
	}
}

function notify(){
	$.mobile.changePage("home.html",{transition: "none", reverse: true, changeHash: true }); 
}

/*
 * function saveUserFriendEmail(){ //Database call var db =
 * window.openDatabase("AppDatabase", "1.0", "Userfriends", 10485760);
 * db.transaction(function(tx){ tx.executeSql('INSERT INTO USERFRIENDS(username,
 * email, friendsemail) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',[$('#name').val(),
 * $('#breed').val(), $('#gender').val(), $('#photoname').val(),
 * $('#specialsdetails').val(), $('#microchipcode').val(), $('#username').val(),
 * $('#password').val(), $('#email').val(), $('#phonenumber').val(),
 * $('#country').val(), $('#city').val(), $('#address').val()]);},
 * Datasavedsuccess); }
 */
function onlineUser() {
	var db = window.openDatabase("AppDatabase", "1.0", "User", 10485760);
    db.transaction(function(tx){
    tx.executeSql('SELECT email FROM USER', [], onlineUsersuccess);
    }, errorCB);
}

function onlineUsersuccess(tx, results) {
	if (results.rows.length != 0) {
		 var email;
		 for(var i=0; i<results.rows.length; i++) {
			 console.log("Email="+results.rows.item(i).email); 
			 email = results.rows.item(i).email;
			 $.ajax({url: 'http://www.doggyfound.com/dfapp/notifications/connection.php',
	                data: "jform[email] ="+ email, 
	                type: 'post',                   
	                async: true,
	                crossDomain:true,
	                success: function (result) {
	                           console.log(result);
	                           //alert(result);
	                  },
	                  error: function (request,error) {
	                        // This callback function will trigger on
							// unsuccessful action
	                        alert('Network error has occurred please try again!');
	                    }
	         });        
		 }
	}
	else {
		console.log('no email');
	}
	
}

function getuserEmail() {
	  var db = window.openDatabase("AppDatabase", "1.0", "User", 10485760);
	    db.transaction(function(tx){
	    tx.executeSql('SELECT email FROM USER', [], getEmailsuccess);
	    }, errorCB);
	  
}
	  
function getEmailsuccess(tx, results) {
	 if (results.rows.length != 0) {
		 var email;
		 for(var i=0; i<results.rows.length; i++) {
			 console.log("Email="+results.rows.item(i).email); 
			 email = results.rows.item(i).email;
			 $.ajax({url: 'http://www.doggyfound.com/dfapp/users/username.php',
	                data: "jform[email] ="+ email, 
	                type: 'post',                   
	                async: true,
	                crossDomain:true,
	                success: function (result) {
	                            resultObject.formSubmitionResult = result;
	                            
	                            $('#usrnme').append('<h3>Hi! '+result+'</h3>').trigger('create');
	                           // $('#user').trigger('create');
	                            $('.settings').listview('refresh'); 
	                            $( "#panelleft" ).trigger( "updatelayout" );
	                  },
	                  error: function (request,error) {
	                        // This callback function will trigger on
							// unsuccessful action
	                        alert('Network error has occurred please try again!');
	                    }
	                });            
			}		 
	 }
}

function getuserData() {
	  var db = window.openDatabase("AppDatabase", "1.0", "User", 10485760);
	    db.transaction(function(tx){
	    tx.executeSql('SELECT email FROM USER', [], getuserDatasuccess);
	    }, errorCB);
	  
}

function getuserDatasuccess(tx, results) {
	 if (results.rows.length != 0) {
		 var email;
		 for(var i=0; i<results.rows.length; i++) {
			 console.log("Email="+results.rows.item(i).email); 
			 email = results.rows.item(i).email;
			 $.ajax({url: 'http://www.doggyfound.com/dfapp/users/userdata.php',
	                data: "jform[email] ="+ email, 
	                type: 'post',                   
	                async: true,
	                crossDomain:true,
	                success: function (result) {
	                	var obj = jQuery.parseJSON( result );
	                	// alert(result);
	    
	                	$('#usrnme').append('<h3>Hi! '+obj.username+'</h3>');
	                	$('#user').trigger('create');
	                	$('[data-role=page]').trigger('pagecreate');
	                	$('.jform_id').val(obj.id);
	                	$('.photoname').val('http://www.doggyfound.com/images/com_appuser/'+ obj.photoupload);
	                	$('.largeImage').attr('src', 'http://www.doggyfound.com/images/com_appuser/'+ obj.photoupload);
	                	$(".name").val(obj.name);
	                	$(".radio").filter("[value="+ obj.gender +"]").attr("checked","checked");
	                	$(".specialdetails").val(obj.specialdetails);
	                	$(".microchipcode").val(obj.microchipcode);
	                	$(".username").val(obj.username);
	                	$(".password").val(obj.password);
	                	$(".email").val(obj.email);
	                	$(".phonenumber").val(obj.phonenumber);
	                	$(".address").val(obj.address);
	                	$('#editprofileform').trigger('create');
	                	$('.breed').val(obj.breed).attr("selected","selected");
	                	$('.country').val(obj.country).attr("selected","selected");
	                	$(".breed").trigger("change");
	                	$(".country").trigger("change");
	                	$('.city').val(obj.city).attr("selected","selected");
	                	$(".city").trigger("change");
	                	
	                	
	                },
	                  error: function (request,error) {
	                        // This callback function will trigger on
							// unsuccessful action
	                        alert('Network error has occurred please try again!');
	                    }
	                });            
			}		 
	 }
	 
}

function getuserFriends() {
	  var db = window.openDatabase("AppDatabase", "1.0", "User", 10485760);
	    db.transaction(function(tx){
	    tx.executeSql('SELECT email FROM USER', [], getuserfriendsDatasuccess);
	    }, errorCB);
	  
}

function getuserfriendsDatasuccess(tx, results) {
	 if (results.rows.length != 0) {
		 var email;
		 for(var i=0; i<results.rows.length; i++) {
			 console.log("Email="+results.rows.item(i).email); 
			 email = results.rows.item(i).email;
			 $.ajax({url: 'http://www.doggyfound.com/dfapp/friends/friendslist.php',
	                data: "jform[email] ="+ email, 
	                type: 'post',                   
	                async: true,
	                crossDomain:true,
	                success: function (result) {
	                	 //alert(result);
	                	if (result==null || result==""){ 
	                		// alert("You have no friends!");
	                		//navigator.notification.alert("You have no friends!", result , "Friends Status" , "OK");
	                		$('<h3>You have no friends!</h3>').insertBefore('#friendslist');
	                	}              	
	                	else {
	                		var obj = jQuery.parseJSON(result);
	                		for(var i = 0; i<obj.length; i++) 
	                		{	
	                			if (obj[i].connection){
	                				connection = 'Online';
	                			}else{
	                				connection = 'Offline';
	                			}
	                			$('#friendslist').append('<li><a href="#"><img src="http://www.doggyfound.com/images/com_appuser/'+ obj[i].photoupload +'" />'+
	                			'<h2>'+ obj[i].name +'</h2><p>'+ obj[i].email +'</p><p><input name="checkbox-1a" id="checkbox-1a" type="checkbox">'+
	                			'<label for="checkbox-1a">Go for a walk</label><input type="hidden" name="jform[email]" id="demail" value="'+ obj[i].email +'">'+
	                			'</p><p>'+ connection +'</p></a><a href="#" id="delete">Delete Friend</a></li>');  
	                			$('#friendslist').listview('refresh');
	                		}
	                	}
	                	
	                },
	                  error: function (request,error) {
	                        // This callback function will trigger on
							// unsuccessful action
	                        alert('Network error has occurred please try again!');
	                    }
	                });            
			}		 
	 }
	 
}

function getusersNumber() {
			 $.ajax({url: 'http://www.doggyfound.com/dfapp/users/users.php', 
	                type: 'post',                   
	                async: true,
	                crossDomain:true,
	                success: function (result) {
	                	$('#no').append(result);
	                	$('#usersno').trigger('create');
	                },
	                  error: function (request,error) {
	                        // This callback function will trigger on
							// unsuccessful action
	                        alert('Network error has occurred please try again!');
	                    }
	                });            
}

function getuserEmailforFriends() {
	  var db = window.openDatabase("AppDatabase", "1.0", "User", 10485760);
	    db.transaction(function(tx){
	    tx.executeSql('SELECT username,email FROM USER', [], getEmailforFriendssuccess);
	    }, errorCB);
}	

function getEmailforFriendssuccess(tx, results) {
	 if (results.rows.length != 0) {
		 var email;
		 var username;
		 for(var i=0; i<results.rows.length; i++) {
			 console.log("Email="+results.rows.item(i).email); 
			 email = results.rows.item(i).email;
			 username = results.rows.item(i).username;
			 
			   $('#hemail').val(email);
			   $('#husername').val(username);
			    // alert(email);
			    // alert(username);
			    var fe = $("#femail").val();
		
			    // Begin Validation
			    if( fe!= ''){

			    	$.ajax({url: 'http://www.doggyfound.com/dfapp/friends/friendsdata.php',
			    		data: $('form#sentfriend').serialize(), // Convert a
																// form to a
																// JSON
														// string representation
			    		type: 'post',                   
			    		async: true,
			    		crossDomain:true,
			    		beforeSend: function() {
			    			// This callback function will trigger before data
							// is sent
			    			$.mobile.showPageLoadingMsg(true); // This will
																// show ajax
														// spinner
			    		},
			    		complete: function() {
			    			// This callback function will trigger on data
							// sent/received
			    			// complete
			    			$.mobile.hidePageLoadingMsg(); // This will hide
															// ajax spinner
			    		},
			    		success: function (result) {
	                        resultObject.formSubmitionResult = result;
	                        if (result.indexOf("already exists") >-1) {
										alert(result);
									} 
									else {
											alert(result);	
											if ($.mobile.activePage.attr("id") == "thankyou") {
												$.mobile.changePage("home.html",{
	        													transition: "none",
	        													reverse: true,
	        													changeHash: true
	    														});
											}
											else {
												$(':input').val('');
												$( "#panelright" ).panel( "close" );
												if ($.mobile.activePage.attr("id") == "friendsdetails") {
													$.mobile.changePage('friends.html', {
													    reloadPage : true
													});
												}
												
												}
											}
	                                    // $.mobile.changePage("thankyou.html");
	                                    // alert('Data have been send');
			    		},
			    		error: function (request,error) {
			    			// This callback function will trigger on
							// unsuccessful
			    			// action
			    			alert('Network error has occurred please try again!');
			    		}
			    	}); 
	            	} 
			    else {
			    	if ($.mobile.activePage.attr("id") == "thankyou") {
			    	// alert('Are you sure? Remember that the more fields you
					// fill... ');
			    	navigator.notification.alert("Are you sure? Remember that the more fields you fill... ", notify , "Doggy Found" , "Continue");
			    	}
			    	else {
			    		$( "#panelright" ).panel( "close" );
			    	}
			    }
			}		 
	 }
}


function sendwalknotification() {
	  var db = window.openDatabase("AppDatabase", "1.0", "User", 10485760);
	    db.transaction(function(tx){
	    tx.executeSql('SELECT email FROM USER', [], sendwalknotificationsuccess);
	    }, errorCB);
	  
}
	  
function sendwalknotificationsuccess(tx, results) {
	if (results.rows.length != 0) {
		 var email;
		 var username;
		 for(var i=0; i<results.rows.length; i++) {
			 console.log("Email="+results.rows.item(i).email); 
			 email = results.rows.item(i).email;
			 username = results.rows.item(i).username;
			 
			   $('#hemail').val(email);
			   $('#husername').val(username);
			   
			 if (device.platform == 'android' || device.platform == 'Android') { 
			   
			 $.ajax({url: 'http://www.doggyfound.com/dfapp/notifications/walkpushergcm.php',
	                data: "jform[email] ="+ email, 
	                type: 'post',                   
	                async: true,
	                crossDomain:true,
	                beforeSend: function() {
		    			$.mobile.showPageLoadingMsg(true); 
		    		},
		    		complete: function() {
		    			$.mobile.hidePageLoadingMsg(); 
		    		},
	                success: function (result) {
	                            resultObject.formSubmitionResult = result;
	                            alert(result);
	                            
	                           // $('#usrnme').append('<h3>Hi! '+result+'</h3>').trigger('create');
	                           // $('#user').trigger('create');
	                           // $( "#panelleft" ).trigger( "updatelayout" );
	                  },
	                  error: function (request,error) {
	                        // This callback function will trigger on
							// unsuccessful action
	                        alert('Network error has occurred please try again!');
	                    }
	                });  
			 }	else
				 {
				 $.ajax({url: 'http://www.doggyfound.com/dfapp/notifications/walkpusherapn.php',
		                data: "jform[email] ="+ email, 
		                type: 'post',                   
		                async: true,
		                crossDomain:true,
		                beforeSend: function() {
			    			$.mobile.showPageLoadingMsg(true); 
			    		},
			    		complete: function() {
			    			$.mobile.hidePageLoadingMsg(); 
			    		},
		                success: function (result) {
		                            resultObject.formSubmitionResult = result;
		                            
		                  },
		                  error: function (request,error) {
		                        // This callback function will trigger on
								// unsuccessful action
		                        alert('Network error has occurred please try again!');
		                    }
		                });  
				 }
		}		 
	 }
}

// onSuccess Geolocation
//
function onSuccess(position) {
	 var db = window.openDatabase("AppDatabase", "1.0", "User", 10485760);
	    db.transaction(function(tx){
	    tx.executeSql('SELECT email FROM USER', [], savecoordinatesuccess);
	    }, errorCB);
	    
	    function savecoordinatesuccess(tx, results) {
	    	if (results.rows.length != 0) {
	    		 var email;
	    	     Latitude = position.coords.latitude;
	    	     Longitude = position.coords.longitude;
	    	     Timestamp = position.timestamp; 
	    	     		    	    
	    		 for(var i=0; i<results.rows.length; i++) {
	    			 console.log("Email="+results.rows.item(i).email); 
	    			 email = results.rows.item(i).email;
	    			   		    			   
	    			 $.ajax({url: 'http://www.doggyfound.com/dfapp/notifications/watchposition.php',
	    	                data: "jform[email] ="+ email + "&jform[lat] ="+ Latitude + "&jform[long] ="+Longitude,
	    	                type: 'post',                   
	    	                async: true,
	    	                crossDomain:true,
	    	                success: function (result) {
	    	                            console.log(result);
	    	                  },
	    	                  error: function (request,error) {
	    	                        // This callback function will trigger on
	    							// unsuccessful action
	    	                        alert('Network error has occurred please try again!');
	    	                    }
	    	                });  
	    			 }
	    		}	
	    }
	    	
   /* var element = document.getElementById('geolocation');
    element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
                        'Longitude: '          + position.coords.longitude             + '<br />' +
                        'Altitude: '           + position.coords.altitude              + '<br />' +
                        'Accuracy: '           + position.coords.accuracy              + '<br />' +
                        'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
                        'Heading: '            + position.coords.heading               + '<br />' +
                        'Speed: '              + position.coords.speed                 + '<br />' +
                        'Timestamp: '          + position.timestamp                    + '<br />';
                        */
}

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

function onBackKeyDown() {
	navigator.notification.confirm(
	        'You are about to exit from DoggyFound!', // message
	        onConfirm,            // callback to invoke with index of button pressed
	        'Exit DoggyFound',           // title
	        'Cancel,Exit'         // buttonLabels
	    );
	
	function onConfirm(buttonIndex) {
	    //alert('You selected button ' + buttonIndex);
		if (buttonIndex == 2){
			navigator.app.exitApp();
		}
	}

    //navigator.app.exitApp();
}

// Called when a photo from Photo Library is successfully retrieved
// 
 function onPhotoURISuccessGallery(imageURI) {
 // alert(imageURI);

// Get the actual name of the photo
 window.resolveLocalFileSystemURI(imageURI,

  function (entry) {

  console.log("fullpath::" + entry.fullPath);
    fullsourcepath = entry.fullPath;
      var fileNameIndex = entry.fullPath.lastIndexOf("/") + 1;
      var filename = entry.fullPath.substr(fileNameIndex);
       $(".photoname").val(filename);
       $(".largeImage").attr('src', entry.fullPath);
       $(".largeImage").css("display", "block");
     });
 }
 
// Called when a photo from Camera is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
  // Uncomment to view the image file URI
  // console.log(imageURI);
  // Get image handle
  // var largeImage = $('.largeImage');
  // Unhide image elements
  $(".photoname").val(imageURI);
  $(".largeImage").attr('src', imageURI);
  $(".largeImage").css("display", "block");
 // alert(largeImage.src);
}

 function capturePhoto() {
  // Take picture using device camera
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, correctOrientation: true,
    destinationType: destinationType.FILE_URI });
}

function getPhoto(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onPhotoURISuccessGallery, onFail, { quality: 50,
    destinationType: destinationType.FILE_URI,
    sourceType: source });
}

// Called if something bad happens.
//
function onFail(message) {
  alert('Failed because: ' + message);
}

 function uploadPhoto(imageURI) {
 		var imageURI=$(".largeImage").attr("src");
 		$.mobile.showPageLoadingMsg(true);
        var options = new FileUploadOptions();
        options.fileKey="jform[photoupload]";
        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
        options.mimeType="multipart/form-data";

        var params = {};
        options.chunkedMode = false;
        options.params = params;
		
        var ft = new FileTransfer();
        ft.upload(imageURI, encodeURI("http://www.doggyfound.com/dfapp/registration/upload.php"), win, fail, options);
        $.mobile.hidePageLoadingMsg();
    }

    function win(r) {
       // alert("Code = " + r.responseCode);
       // alert("Response = " + r.response);
       // alert("Sent = " + r.bytesSent); 
       // alert("Photo Uploaded");
    }

    function fail(error) {
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }
    
// End of Phonegap Scripts
    
function sendalertconfirm(btn){
	if (btn == 2){
		var db = window.openDatabase("AppDatabase", "1.0", "User", 10485760);
	    db.transaction(function(tx){
	    tx.executeSql('SELECT email FROM USER', [], alertsuccess);
	    }, errorCB);
	    
	    function alertsuccess(tx, results){
	    	if (results.rows.length != 0) {
	   		 var email;
	   		 var username;
	   		 for(var i=0; i<results.rows.length; i++) {
	   			 console.log("Email="+results.rows.item(i).email); 
	   			 email = results.rows.item(i).email;
	   			 username = results.rows.item(i).username;
	   			   
	   			 if (device.platform == 'android' || device.platform == 'Android') { 
	   			   
	   			 $.ajax({url: 'http://www.doggyfound.com/dfapp/notifications/alertpushergcm.php',
	   	                data: "jform[email] ="+ email, 
	   	                type: 'post',                   
	   	                async: true,
	   	                crossDomain:true,
	   	                beforeSend: function() {
	   		    			$.mobile.showPageLoadingMsg(true); 
	   		    		},
	   		    		complete: function() {
	   		    			$.mobile.hidePageLoadingMsg(); 
	   		    		},
	   	                success: function (result) {
	   	                            resultObject.formSubmitionResult = result;
	   	                            alert(result);
	   	                            
	   	                           // $('#usrnme').append('<h3>Hi! '+result+'</h3>').trigger('create');
	   	                           // $('#user').trigger('create');
	   	                           // $( "#panelleft" ).trigger( "updatelayout" );
	   	                  },
	   	                  error: function (request,error) {
	   	                        // This callback function will trigger on
	   							// unsuccessful action
	   	                        alert('Network error has occurred please try again!');
	   	                    }
	   	                });  
	   			 }	else
	   				 {
	   				 $.ajax({url: 'http://www.doggyfound.com/dfapp/notifications/alertpusherapn.php',
	   		                data: "jform[email] ="+ email, 
	   		                type: 'post',                   
	   		                async: true,
	   		                crossDomain:true,
	   		                beforeSend: function() {
	   			    			$.mobile.showPageLoadingMsg(true); 
	   			    		},
	   			    		complete: function() {
	   			    			$.mobile.hidePageLoadingMsg(); 
	   			    		},
	   		                success: function (result) {
	   		                            resultObject.formSubmitionResult = result;
	   		                            
	   		                  },
	   		                  error: function (request,error) {
	   		                        // This callback function will trigger on
	   								// unsuccessful action
	   		                        alert('Network error has occurred please try again!');
	   		                    }
	   		                });  
	   				 }
	   		}		 
	   	 }
	    }
		
	}
}
    
// Send data to server and phonedatabase
$(document).on('click', '#submitbtn', function() {
		// alert('hey');
		var n = $("#name").val();
		var ph = $("#photoname").val();
		var u = $("#username").val();
		var p = $("#password").val();
		var e = $("#email").val();
		
		// Begin Validation
		if(n != ''  && ph != '' && u != '' && p!= '' && e!= ''){

		$.ajax({url: 'http://www.doggyfound.com/dfapp/registration/profiledata.php',
                data: $('form#send_data').serialize(), // Convert a form to a
														// JSON string
														// representation
                type: 'post',                   
                async: true,
                crossDomain:true,
                beforeSend: function() {
                 // This callback function will trigger before data is sent
                	$.mobile.showPageLoadingMsg(true); // This will show ajax
														// spinner
                },
                complete: function() {
                 // This callback function will trigger on data sent/received
					// complete
                 	$.mobile.hidePageLoadingMsg(); // This will hide ajax
													// spinner
                 },
                 success: function (result) {
                            resultObject.formSubmitionResult = result;
								if (result.indexOf("Could") >-1) {
    									alert(result);
									} 
									else {
											uploadPhoto();
											saveUserData();
											$.mobile.changePage("thankyou.html",{
            													transition: "none",
            													reverse: true,
            													changeHash: true
        														});
										//alert(result);
									}		
                                        
                  },
                  error: function (request,error) {
                        // This callback function will trigger on unsuccessful
						// action
                        alert('Network error has occurred please try again!');
                    }
                });                    
       } 
		else {
            alert('Please fill all nececery fields marked with red color!Remember that the more fields you fill... ');
            $( '.required .ui-input-text.ui-shadow-inset.ui-corner-all.ui-btn-shadow.ui-body-c, .required .ui-input-text.ui-shadow-inset.ui-corner-all.ui-btn-shadow.ui-body-c, .required .ui-btn-up-c' ).css( 'border', '1px solid #FF0000' );
       }         
            return false;
});

// Send edit data to server and phonedatabase

$(document).on('click', '#editbtn', function() {
	// alert('hey');
	var n = $(".name").val();
	var ph = $(".photoname").val();
	var u = $(".username").val();
	var p = $(".password").val();
	var e = $(".email").val();
	
	// Begin Validation
	if(n != ''  && ph != '' && u != '' && p!= '' && e!= ''){

	$.ajax({url: 'http://www.doggyfound.com/dfapp/registration/profiledata_edit.php',
            data: $('form#editprofileform').serialize(), // Convert a form to
															// a JSON string
															// representation
            type: 'post',                   
            async: true,
            crossDomain:true,
            beforeSend: function() {
             // This callback function will trigger before data is sent
            	$.mobile.showPageLoadingMsg(true); // This will show ajax
													// spinner
            },
            complete: function() {
             // This callback function will trigger on data sent/received
				// complete
             	$.mobile.hidePageLoadingMsg(); // This will hide ajax spinner
             },
             success: function (result) {
                        resultObject.formSubmitionResult = result;
							if (result.indexOf("Could") >-1) {
									alert(result);
								} 
								else {
									//alert(ph);
									if (ph.indexOf("http://www.doggyfound.com/images/com_appuser/") < 0) {
										uploadPhoto();
									}
										// saveUserData();
										updateUserData();
										alert(result);
										$.mobile.changePage("home.html",{
        													transition: "none",
        													reverse: true,
        													changeHash: true
    														});
								}		
                                    // $.mobile.changePage("thankyou.html");
                                    // alert('Data have been send');
              },
              error: function (request,error) {
                    // This callback function will trigger on unsuccessful
					// action
                    alert('Network error has occurred please try again!');
                }
            });                    
   } 
	else {
        alert('Please fill all nececery fields marked with red color!Remember that the more fields you fill... ');
        $( '.required .ui-input-text.ui-shadow-inset.ui-corner-all.ui-btn-shadow.ui-body-c, .required .ui-input-text.ui-shadow-inset.ui-corner-all.ui-btn-shadow.ui-body-c, .required .ui-btn-up-c' ).css( 'border', '1px solid #FF0000' );
   }         
        return false;
});

var resultObject = {
    formSubmitionResult : null  
};
// Capture photo calls

/*
 * $(document).on('click', '#addphoto', function() {
 * navigator.notification.confirm( 'Please choose a photo from', // message
 * onConfirm, // callback to invoke with index of button pressed "Choose your
 * dog's photo", // title 'Camera, Gallery, Cancel' // buttonLabels ); });
 * 
 * function onConfirm(b){ if(b == 1){ // BUTTON 1 WAS CLICKED capturePhoto(); }
 * if(b == 2) { // BUTTON 2 WAS CLICKED getPhoto(pictureSource.PHOTOLIBRARY); } }
 */

$(document).on('click', '#capture', function() {
            capturePhoto();
            $('#popupDialog').popup("close");
});

$(document).on('click', '#getImg', function() {
      getPhoto(pictureSource.PHOTOLIBRARY);
      $('#popupDialog').popup("close");
});

$(document).on('click', '#capture_edit', function() {
    capturePhoto();
    $('#popupDialog_edit').popup("close");
});

$(document).on('click', '#getImg_edit', function() {
getPhoto(pictureSource.PHOTOLIBRARY);
$('#popupDialog_edit').popup("close");
});


// Send to a friend adding fields script
$(document).on("pageshow",function() {
    var scntDiv = $('#env');
    var i = $('#set').size() + 1;
    
    $(document).on('click','#add', function() {
            $("<div data-role='fieldcontain' id='set" + i + "' class='line ui-field-contain ui-body ui-br'><fieldset class='ui-grid-a'><div class='ui-block-a' style='width: 80%;'><label id='name' for='femail' class='ui-hidden-accessible'>Send to a friend:</label><input name='jform[femail][]' id='femail' value='' type='email' placeholder='Put the email of your friend'></div><div class='ui-block-b' style='width: 20%;'><button id='delete' type='button' data-icon='minus' data-theme='b' data-iconpos='notext' data-mini='true' data-inline='true'>Delete</button></div></fieldset></div>").appendTo(scntDiv).trigger('create');
            i++;
            return false;
    });
    
    $(document).on('click','#delete', function() { 
            // if( i > 2 ) {
                    $(this).parents('.line').remove();
                 // i--;
        // }
            return false;
    });
});

// Send users friends emails to server
$(document).on('click', '#submitmail', function() {
	// alert('hey');
	getuserEmailforFriends();  
	 return false;
});		
$(document).on("pageshow","#home",function() {
	getuserEmail();
	getusersNumber();
	var options = { timeout: 30000, enableHighAccuracy: true };
	watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
	});

$(document).on("pageshow","#editprofile",function() {
	getuserData();
	}); 

$(document).on('pageshow', '#friendsdetails', function() {
	getuserFriends();
	getuserEmail();
	
});

$(document).on('click', '#delete', function() {
	
	var listitem = $( this ).parent( "li.ui-li" );
    confirmAndDelete( listitem );
    
    function confirmAndDelete( listitem) {
        // Highlight the list item that will be removed
        listitem.addClass( "ui-btn-down-d" );
        // Inject topic in confirmation popup after removing any previous
		// injected topics
        $( "#deletefriend h2" ).remove();
        listitem.find( "h2" ).clone().insertAfter( "#question" );
        // Show the confirmation popup
        $( "#deletefriend" ).popup( "open" );
        // Proceed when the user confirms
        $( "#deletefriend #permdelete" ).on( "click", function() {
                listitem.remove();
                $.ajax({url: 'http://www.doggyfound.com/dfapp/friends/deletefriend.php',
                    data: listitem.find('#demail').serialize(), // Convert a
																// form to
        															// a JSON
																	// string
        															// representation
                    type: 'post',                   
                    async: true,
                    crossDomain:true,
                    beforeSend: function() {
                     // This callback function will trigger before data is
						// sent
                    	$.mobile.showPageLoadingMsg(true); // This will show
															// ajax
        													// spinner
                    },
                    complete: function() {
                     // This callback function will trigger on data
						// sent/received
        				// complete
                     	$.mobile.hidePageLoadingMsg(); // This will hide ajax
														// spinner
                     },
                     success: function (result) {
                                resultObject.formSubmitionResult = result;
                                // alert(result);
                                alert("Your friend has been succesfully deleted!");
        							
                      },
                      error: function (request,error) {
                            // This callback function will trigger on
							// unsuccessful
        					// action
                            alert('Network error has occurred please try again!');
                        }
                    });                    
                // $('#popupDialog').popup("close");
                $( "#friendslist" ).listview( "refresh" );
                // return false;
            
        });
        // Remove active state and unbind when the cancel button is clicked
        $( "#deletefriend #cancel" ).on( "click", function() {
            listitem.removeClass( "ui-btn-down-d" );
            $( "#deletefriend #permdelete" ).off();
        });
    }
});

$(document).on('click', '.walk', function() {
	// alert('hey');
	sendwalknotification();  
	 return false;
});	

$(document).on('click', '.alert', function() {
	// alert('hey');
	navigator.notification.confirm(
	        'Do you really lost your dog?Please procced quickly to alert the DoggyFounders!', // message
	        sendalertconfirm,            // callback to invoke with index of button pressed
	        'Alert! There is a missing Dog',           // title
	        'Cancel,Procceed'         // buttonLabels
	    ); 
	 return false;
});	
