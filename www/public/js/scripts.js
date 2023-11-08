var urls="https://mwpf.co.za/mobile/server/";


$(document).ready(function(){
//alert('it works main');
    
    // LOG IMPORTANT VARIABLES
    
var user = localStorage.getItem('SessionKey');
    var name = localStorage.getItem('MemberName');
    var memberId = localStorage.getItem('personID');

 //alert(localStorage.getItem('mID'));
    // Check the session
    
if (user) {
$("p.mwpf_black").html('<bold>'+name+'</bold>');

             // Get the Statement

	// REQUEST TO INVESTMENT TO GET MEMBER ID
	
      $.ajax({      url:urls+'api/Investment.php',
                    type: 'GET',					
					data: {
                    session:user,
                    personId:memberId
                        },
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(data){					
					 var result =  JSON.parse(data);
						  console.log(result);
                      if(result){
                           console.log('GET MEMBER ID');
						   console.log(result);  
						   console.log('MEMBER ID');
						  // console.log(data.Funds[0].Investments[0].MemberId);
						 // alert(result.Funds[0].MemberId);
						    localStorage.setItem('mID',result.Funds[0].MemberId);						  
                          }
                        
                        else{
							console.log(data);
                        }                                             
                    },
                    error: function(data){
						console.log('Error ! ');
                    }                 
                     }); // End of INVESTMENT	
test();
showfile();
	getStatementd();

	getBalance();
// END OG GET BALANCE FUNCTION
	// GET BALANCE
    UpdatePersonalinfo ();
    UpdatePersonalData();
   // Get balance
   // getBalance() ; 
  //var statement = getStatementd();
  //GET PERSONAL DETAILS
  // Get Statement
 
	// GET PERSONAL DETAILS
	personalinfo();				  
	//Get investment
    getInvestments();
    getContributionRate();
    getExitInfo();
    getBeneficiaries();


    getBenefitStatement();


   /// setTimeout(getBeneficiaries, 2000);

$(document).on('click','.homebutton', function(){
      
     // localStorage.clear("industry_number"); 
	var user = localStorage.clear('SessionKey');
    var name = localStorage.clear('MemberName');
    var memberId = localStorage.clear('personID');

     window.location="index.html";     

});
	
	
	
	
//function getBalance(){ 
//    
//    // Initialise varables
//    
//        var sessionId = localStorage.getItem('SessionKey');
//        var memberId = localStorage.getItem('personID');
//        var UserN = localStorage.getItem('Username');
//      
//
//        $('#loader').show();
//       
//        //var action = "get_members_details";
//
//        $.post(urls + 'getBalance.php',
//               JSON.stringify({
//                    url: 'http://192.168.30.3:8090/EBSphere.Service_deploy/api/Statement',
//                     parameters: {
//                            sessionKey: sessionId,
//                            memberID  : memberId
//                            }
//                        }),
//               
//               function(json){
//	        $.each(json.result,function(i,data){
//                
//                console.log('GET BALANCE');
//                 console.log(json);
//                
//	            //  $("#tab-1").html('<a href="#">Name: </a>'+data.name+'<br> <a href="#">Surname: 
//              //  $("p.mwpf_black").html('<bold>'+data.Amount+'</bold>');
//	        });
//     
//        },'json'); 
//                 
//    }    
    

	
		
		

			
	
	
	 	
 
	// clear all intervals

	
$(document).on('click','.homebutton', function(){

       
      localStorage.clear("SessionKey");  
     window.location="index.html";     

});



	

	
	


}
else{

    // If no session is set go to login page
    
    localStorage.clear("SessionKey");  
	window.location="index.html";

}


});




function showfile(){
//alert('test');
	var memberId = localStorage.getItem('mID'); 			
	var path ="https://mwpf.co.za/mobile/server/api/statements/" + memberId + ".pdf";
if ( path != '') {
showfile = setInterval(function(){ 
    var html = "<a href='https://mwpf.co.za/mobile/server/api/statements/"+memberId+".pdf'>View Benefit Statement</a>";
$('p#tab-2').html(html);
   }, 1000);

}else{
showfile = setInterval(function(){ 
    var html = "<a href='#'>Benefit Statement Not Available</a>";
$('p#tab-2').html(html);
   }, 1000);
} 
	

}

	// GET PERSONAL DETAILS


	function test(){
		
			   // alert('test');
          //	   var sessionId = localStorage.getItem('SessionKey');
         //        var member = localStorage.getItem('personID');
         //        var UserN = localStorage.getItem('Username');
			    //  alert(user);
				var user = localStorage.getItem('SessionKey'); 				
				var mID = localStorage.getItem('mID'); 
					$('#loader').show();
                $.ajax({			
                    url:urls+'api/getBeneficiariesbase64File.php',
                    type: 'GET',					
					data: {
                    session:user,
                    personId:mID
                        },
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(data){		  			
					 var result =  JSON.parse(data);
				alert(data);
						  console.log(result);
                      if(result){
                         console.log('GET Benefit statement file');
						   console.log(result); 
						   	//	 var bstatement = setInterval(function(){ 
							  	  $("#tab-2").html('<a href="https://mwpf.co.za/mobile/server/api/statements/9762.pdf">View Benefit Statement</a>').show();   
							   console.log(data.Details.MemberNo);
							 
						//	   }, 1000);

                          }                      
                        else{
							console.log(data);	


//                         
//                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
//                             $('#loader').hide();

                        }                    
                           
                    },
                    error: function(data){

                           $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
                           $('#loader').hide();
                          //$btn.button("reset");

                    }
                 

                     });
		

	}

	
	function personalinfo () { 
	//alert('it works');
//	   var sessionId = localStorage.getItem('SessionKey');
//        var member = localStorage.getItem('personID');
//        var UserN = localStorage.getItem('Username');
			    //  alert(user);
		 var user = localStorage.getItem('SessionKey'); 
		 var mID = localStorage.getItem('mID');
                $.ajax({
                    url:urls+'api/getPersonalDetails.php',
                    type: 'GET',					
					data: {
                    session:user,
                    personId:mID
                        },
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(res){					
					  var data =  JSON.parse(res);
							//console.log(result);   
						 // console.log(result.Name);
					///	alert(data);
					 // var test = new Object();
						
                      if(data){
                         console.log('GET PERSONAL INFO');
						   //console.log(result.Surname); 							  	
						//alert(data.Details.Surname);
						   //$.each(json.result,function(i,data){
						  
						  var profile = setInterval(function(){ 
							  	  $("#tab-1").html('<a href="#">Firstname: </a>'   +data.Details.Firstname+'<br> <a href="#">Surname: </a>'   +data.Details.Surname+'<br><a href="#">Date of birth: </a>'   +data.Details.DateOfBirth+'<br><a href="#">ID number: </a>'   +data.Details.IDNumber+'<br><a href="#">Date Joined Fund: </a>'   +data.Details.DateJoinedFund+'<br><a href="#">Date Pensionnable Fee: </a>'   +data.Details.DatePensionableService+'<br> <a href="#">Normal Retirement Date: </a>'   +data.Details.NormalRetirementDate+'<br> <a href="#">Date Exit: </a>'   +data.Details.DateOfExit+'<br><a href="#">Member No: </a>'   +data.Details.MemberNo+'<br>').show();   
							   console.log(data.Details.MemberNo);
							   }, 1000);						  
						  // });
//	              $('#loader').hide();  
												 
                       }
                        
                        else{

							console.log(data);    
//
//                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
//                             $('#loader').hide();

                        }
                      
                           
                    },
                    error: function(data){

//                           $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
//                           $('#loader').hide();
                          //$btn.button("reset");

                    }
                 

                     });
		
	
	}// END OF GET PERSONAL DETAILS
	
	









	
		function UpdatePersonalinfo () { 
	//alert('it works');
//	   var sessionId = localStorage.getItem('SessionKey');
//        var member = localStorage.getItem('personID');
//        var UserN = localStorage.getItem('Username');
			    //  alert(user);  
				 var user = localStorage.getItem('SessionKey'); 
			     var mID = localStorage.getItem('mID');
                $.ajax({
                    
                    url:urls+'api/getPersonalDetails.php',
                    type: 'GET',					
					data: {
                    session:user,
                    personId:mID
                        },
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(res){					
					  var data =  JSON.parse(res);
						//	console.log(result);   
						 // console.log(result.Name);
						//alert(result);
					//	alert(res);
					 // var test = new Object();
						
                      if(data){
                         console.log('GET PERSONAL DETAILS');
					  //console.log(result.Surname); 							  	
						
						   //$.each(json.result,function(i,data){
												  							  
							var updateInfo = setInterval(function(){ 
							$("#fname").val(data.Details.Firstname);
					        $("#surname").val(data.Details.Surname);
					        $("#dfb").val(data.Details.DateOfBirth);
					        $("#id_number").val(data.Details.IDNumber);
					        $("#djoined").val(Details.DateJoinedFund);
					        $("#pensiondate").val(data.Details.DatePensionableService);
					        $("#exitdate").val(data.Details.DateOfExit);
					        $("#ids").val(data.id);
					        $("#village").val(data.village);
					        $("#employer").val(data.current_employer);
					        $("#address").val();
					        $("#mobile").val(data.mobile);
						 	   }, 1000);
							   
							
						  
						  // });
//	              $('#loader').hide();  
												 
                       }
                        
                        else{

							console.log(data);    
//
//                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
//                             $('#loader').hide();

                        }
                      
                           
                    },
                    error: function(data){

//                           $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
//                           $('#loader').hide();
                          //$btn.button("reset");

                    }
                 

                     });
		
	
	}



			function UpdatePersonalData() { 
//alert('it works');
//	   var sessionId = localStorage.getItem('SessionKey');
//        var member = localStorage.getItem('personID');
//        var UserN = localStorage.getItem('Username');
			    //  alert(user);  
				 var user = localStorage.getItem('SessionKey'); 
			     var mID = localStorage.getItem('mID');
                $.ajax({
                    
                    url:urls+'api/detailsUpdates.php',
                    type: 'GET',					
					data: {
                    personId:mID
                        },
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(res){					
					  var data =  JSON.parse(res);
							console.log(result); 
							console.log(data);   
						 // console.log(result.Name);
						//alert(result);
						alert(res);
					 // var test = new Object();
						
                      if(data){
                         console.log('GET MORE  DETAILS');
					  console.log(res); 							  	
						
						   //$.each(json.result,function(i,data){
												  							  
							var updateInfos = setInterval(function(){ 
							
					        // $("#address").val('hi there');
					        // $("#mobile").val(data);
						 	   }, 1000);
							   
							
						  
						  // });
//	              $('#loader').hide();  
												 
                       }
                        
                        else{

							console.log(data);    
//
//                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
//                             $('#loader').hide();

                        }
                      
                           
                    },
                    error: function(data){

//                           $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
//                           $('#loader').hide();
                          //$btn.button("reset");

                    }
                 

                     });
		
	
	}
	
	
	// GET FUND BALANCE
	function getBalance(){
	
//	   var sessionId = localStorage.getItem('SessionKey');
//        var member = localStorage.getItem('personID');
//        var UserN = localStorage.getItem('Username');
	   var user = localStorage.getItem('SessionKey');              
        var mID = localStorage.getItem('mID');       
		$.ajax({
                    
                    url:urls+'api/getinvestments.php',
                    type: 'GET',					
					data: {
                    session:user,
                    personId:mID
                        },
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(data){					
					 var result =  JSON.parse(data);
						  console.log(result);
                      if(result){
                         console.log('GET BALANCE');
						   console.log(data);
                        						 
						 //alert(result.CurrentTotalValue);
						 var bal = setInterval(function(){
						 $("p.mwpf_black_").html('<bold>'+result.CurrentTotalValue+'</bold>');
						  }, 1000);		
						
							
							   
                                  // localStorage.setItem('SessionKey',data.SessionKey);
                                 //localStorage.setItem('personID',data.personID);
                                // localStorage.setItem('MemberName',data.MemberName);
                               //  window.location.replace("dashboard.html");
                          }
                        
                        else{

							console.log(data);
//
//                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
//                             $('#loader').hide();

                        }
                      
                           
                    },
                    error: function(data){

                           $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
                           $('#loader').hide();
                          //$btn.button("reset");

                    }
                 

                     });
		
		}
	
	
	
	
	// GET INVESTMENT DETAILS
	function getInvestments(){
	
//	   var sessionId = localStorage.getItem('SessionKey');
//        var member = localStorage.getItem('personID');
//        var UserN = localStorage.getItem('Username');
			    //  alert(user);
          var user = localStorage.getItem('SessionKey'); 				
		 var mID = localStorage.getItem('mID');  
                $.ajax({                    
                   url:urls+'api/getinvestments.php',
                    type: 'GET',					
					data: {
                    session:user,
                    personId:mID
                        },
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(data){					
					 var result =  JSON.parse(data);
						  console.log(result);
                      if(result){
                         console.log('GET INVESTMENT');
						   console.log(data);
                        						 
						 //alert(result.CurrentTotalValue);
						
						 $("p.mwpf_black_").html('<bold>'+result.CurrentTotalValue+'</bold>');
//                       
						 
				 var getinvestments =  setInterval(function(){	
					  // alert(result.Investments[0].InvestmentDate);
				 $("#tab-3").html('<a href="#">Date: </a>'+result.Investments[0].InvestmentDate+'<br/><a href="#">Product: </a>'+result.Investments[0].Product+
				 '<br> <a href="#">Units: </a>'+result.Investments[0].Units+'<br><a href="#">Price: </a>'+result.Investments[0].Price+'<br><a href="#">Value: </a>'+result.Investments[0].Value+'<br>').show(); 
				  	}, 2000);	
				   
                                  // localStorage.setItem('SessionKey',data.SessionKey);
                                 //localStorage.setItem('personID',data.personID);
                                // localStorage.setItem('MemberName',data.MemberName);
                               //  window.location.replace("dashboard.html");
                          }
                        
                        else{

							console.log(data);
//
//                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
//                             $('#loader').hide();

                        }
                      
                           
                    },
                    error: function(data){

                           $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
                           $('#loader').hide();
                          //$btn.button("reset");

                    }
                 

                     });
		
		}
	
	
	
	
		
		 //GET STATEMENT
		
			function getStatementd(){
	
//	   var sessionId = localStorage.getItem('SessionKey');
//        var member = localStorage.getItem('personID');
//        var UserN = localStorage.getItem('Username');
			    //  alert(user);
				var user = localStorage.getItem('SessionKey'); 				
				var mID = localStorage.getItem('mID'); 
					$('#loader').show();
                $.ajax({
                    				
                    url:urls+'api/getStatementv2.php',
                    type: 'GET',					
					data: {
                    session:user,
                    personId:mID
                        },
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(data){		  			
					 var result =  JSON.parse(data);
						  console.log(result);
                      if(result){
                         console.log('GET STATEMENT V2');
						 console.log(result['LastContributions']['ContributionTotal']); 


				  var getstatement = setInterval(function(){ 
				 $("#tab-2").html('<a href="#">Statement Date: </a>'+result['StatementDate']+
				 '<br> <a href="#">Last Annual Salary: </a>'+result['LastAnnualSalary']+'<br><a href="#">Category: </a>'+result['Category']+'<br><a href="#">Paypoint: </a>'+result['Paypoint']+'<br><a href="#">Employer Name: </a>'+result['EmployerName']+'<br><a href="#">Last Risk Salary: </a>'+result['LastRiskSalary']+'<br/><br/><a href="#">Withdrawal: </a>'+result['Benefit']['Withdrawal']+'<br><a href="#">Death: </a>'+result['Benefit']['Death']+'<br><a href="#">Retirement: </a>'+result['Benefit']['Retirement']+'<br><a href="#">Date Of Exit: </a>'+result['Benefit']['DateOfExit']+'<br><a href="#">Last Contribution Date: </a>'+result['LastContributions']['LastContributionDate']+'<br><a href="#">Contribution Total: </a>'+result['LastContributions']['ContributionTotal']+'<br>').show(); 
				       }, 2000);	
			   
			
					  	$("#loader").hide();
                          }                      
                        else{
							console.log(data);		
//
//                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
//                             $('#loader').hide();

                        }                    
                           
                    },
                    error: function(data){

                           $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
                           $('#loader').hide();
                          //$btn.button("reset");

                    }
                 

                     });
		
		}
	



		 //GET CONTRIBUTION RATE
		
			function getContributionRate(){

//	    var sessionId = localStorage.getItem('SessionKey');
//      var member = localStorage.getItem('personID');
//      var UserN = localStorage.getItem('Username');
			    //  alert(user);
				var user = localStorage.getItem('SessionKey'); 				
				var mID = localStorage.getItem('mID'); 
					$('#loader').show();
                $.ajax({
                    				
                    url:urls+'api/getContributionRate.php',
                    type: 'GET',					
					data: {
                    session:user,
                    personId:mID
                        },
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(data){		  			
					 var result =  JSON.parse(data);
						  console.log(result);
						//  alert(result);
                      if(result){
                         console.log('GET CONTRIBUTION RATE');
						   console.log(result); 
						   console.log('Contribution Rate');                  			  
                   console.log(result[0].EffectiveDate);
				  var getContributionRate = setInterval(function(){ 
				 $("#tab-4").html('<a href="#">EEDeemedFixed: </a>'+result[0].EEDeemedFixed+'<br><a href="#">EEDeemedRate: </a>'+result[0].EEDeemedRate+'<br><a href="#">EEFixed: </a>'+result[0].EEFixed+'<br><a href="#">EERate: </a>'+result[0].EERate+'<br/><br/><a href="#">ERFixed: </a>'+result[0].ERFixed+'<br><a href="#">ERRate: </a>'+result[0].ERRate+'<br><a href="#">EffectiveDate: </a>'+result[0].EffectiveDate+'<br><a href="#">EscDate: </a>'+result[0].EscDate+'<br><a href="#">EscPercentage: </a>'+result[0].EscPercentage+'<br><a href="#">FromAge: </a>'+result[0].FromAge+'<br><a href="#">ToAge: </a>'+result[0].ToAge+'<br>').show(); 
				       }, 2000);	
			   
			
					  	$("#loader").hide();
                          }                      
                        else{
							console.log(data);		
//
//                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
//                             $('#loader').hide();

                        }                    
                           
                    },
                    error: function(data){

                           $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
                           $('#loader').hide();
                          //$btn.button("reset");

                    }
                 

                     });
		
		}



			 //GET BENEFICIARIES
		
			function getBeneficiaries(){
	
//	   var sessionId = localStorage.getItem('SessionKey');
//        var member = localStorage.getItem('personID');
//        var UserN = localStorage.getItem('Username');
			    //  alert(user);
				var user = localStorage.getItem('SessionKey'); 				
				var mID = localStorage.getItem('mID'); 
					$('#loader').show();
                $.ajax({
                    				
                    url:urls+'api/getNominatedBeneficiaries.php',
                    type: 'GET',					
					data: {
                    session:user,
                    personId:mID
                        },
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(data){		  			
					 var result =  JSON.parse(data);
					  console.log('GET NOMINATED BENEFICIARIES 1st');
					  console.log(result);
						 
                      if(result){
                         console.log('GET NOMINATED BENEFICIARIES');
                      //   var results= $.parseJSON(result); 
						//   console.log(results); 
						 //  console.log('GET NOMINATED BENEFICIARIES');                  			  

				 var getbeneficiaries = setTimeout(function(){ 
				// var result= $.parseJSON(result); 

              //  var string = "<ul>";
    
          /* from result create a string of data and append to the div */

          $.each(result, function( key, dat ) {             
         // key + ':' +dat.Firstname; 
//console.log(value['IDNumber']);
  // console.log(dat['Firstname']); 
  // console.log(result[0].EffectiveDate);
  //         dat['Firstname']; 

  console.log('First Name :'  +dat['Firstname']);

//$('#tab-5').append('First Name :'  +dat['Firstname']);
    //  list = dat['IDNumber'];

     // $("#tab-5").html("<ul><li>"+value['IDNumber']+"</li></ul>");

    //alert(key, dat['IDNumber']);

  //$("#tab-5").html(dat['IDNumber']);
  $("#tab-5").append('<a href="#">EffectiveDate: </a>'+dat.EffectiveDate+'<br><a href="#">Firstname: </a>'+dat.Firstname+'<br><a href="#">Surname: </a>'+dat.Surname+'<br><a href="#">IDNumber: </a>'+dat.IDNumber+'<br/><br/><a href="#">DateOfBirth: </a>'+dat.DateOfBirth+'<br><a href="#">Gender: </a>'+dat.Gender+'<br><a href="#">Phonenumber: </a>'+dat.Phonenumber+'<br><a href="#">Address: </a>'+dat.Address+'<br><a href="#">BankAccount: </a>'+dat.BankAccount+'<br><a href="#">BankAccountHolder: </a>'+dat.BankAccountHolder+'<br><a href="#">BranchCode: </a>'+dat.BranchCode+'<br><a href="#">BranchName: </a>'+dat.BranchName+'<br><a href="#">BankName: </a>'+dat.BankName+'<br><a href="#">BeneficiaryType: </a>'+dat.BeneficiaryType+ '<br><a href="#">Percentage: </a>'+dat.Percentage+'<br><h3>----------------------------------------------</h3><br>').show(); 
    }); 
// $("#tab-5").html(string);
                              }, 2000);	
            //   string += "</ul>"; 
         // console.log('list');
       // console.log(list);

         //  	setInterval(getbeneficiaries, 1000);

          // getbeneficiaries ='';


// var getbeneficiaries = setInterval(function(){ 
// 					$.each(result,function(i,dat){
						
// 				counter++;
//   console.log('GET NOMINATED BENEFICIARIES LOOP');
// 				//alert(dat);

//       //  $("#tab-5").html('<a href="#">EffectiveDate: </a>'+dat.EffectiveDate+'<br><a href="#">Firstname: </a>'+dat.Firstname+'<br><a href="#">Surname: </a>'+dat.Surname+'<br><a href="#">IDNumber: </a>'+dat.IDNumber+'<br/><br/><a href="#">DateOfBirth: </a>'+dat.DateOfBirth+'<br><a href="#">Gender: </a>'+dat.Gender+'<br><a href="#">Phonenumber: </a>'+dat.Phonenumber+'<br><a href="#">Address: </a>'+dat.Address+'<br><a href="#">BankAccount: </a>'+dat.BankAccount+'<br><a href="#">BankAccountHolder: </a>'+dat.BankAccountHolder+'<br><a href="#">BranchCode: </a>'+dat.BranchCode+'<br><a href="#">BranchName: </a>'+dat.BranchName+'<br><a href="#">BankName: </a>'+dat.BankName+'<br><a href="#">BeneficiaryType: </a>'+dat.BeneficiaryType+ '<br><a href="#">Percentage: </a>'+dat.Percentage+'<br>').show(); 
// console.log(dat['EffectiveDate']);
// 					})
//                 counter=0; 
//                   }, 2000);	


// 				each($(result), function(key, value) {


// //$("#tab-5").html('<a href="#">EffectiveDate: </a>'+result[0].EffectiveDate+'<br><a href="#">Firstname: </a>'+result[0].Firstname+'<br><a href="#">Surname: </a>'+result[0].Surname+'<br><a href="#">IDNumber: </a>'+result[0].IDNumber+'<br/><br/><a href="#">DateOfBirth: </a>'+result[0].DateOfBirth+'<br><a href="#">Gender: </a>'+result[0].Gender+'<br><a href="#">Phonenumber: </a>'+result[0].Phonenumber+'<br><a href="#">Address: </a>'+result[0].Address+'<br><a href="#">BankAccount: </a>'+result[0].BankAccount+'<br><a href="#">BankAccountHolder: </a>'+result[0].BankAccountHolder+'<br><a href="#">BranchCode: </a>'+result[0].BranchCode+'<br><a href="#">BranchName: </a>'+result[0].BranchName+'<br><a href="#">BankName: </a>'+result[0].BankName+'<br><a href="#">BeneficiaryType: </a>'+result[0].BeneficiaryType+ '<br><a href="#">Percentage: </a>'+result[0].Percentage+'<br>').show(); 
// 			$("#tab-5").html('<a href="#">+'key'+: </a>'+value+'<br>').show(); 

// 				 //   alert(key + "=" + value);
// 				});

				      // }, 2000);	
			   
					  	$("#loader").hide();
                          }                      
                        else{
							console.log(data);		
//
//                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
//                             $('#loader').hide();
                        }                       
                    },
                    error: function(data){

                           $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
                           $('#loader').hide();
                          //$btn.button("reset");

                    }
                 

                     });
clearInterval(getbeneficiaries);
		
		}

	







		 //GET Document List
		
			function getExitInfo(){
	
//	   var sessionId = localStorage.getItem('SessionKey');
//        var member = localStorage.getItem('personID');
//        var UserN = localStorage.getItem('Username');
			    //  alert(user);
				var user = localStorage.getItem('SessionKey'); 				
				var mID = localStorage.getItem('mID'); 
					$('#loader').show();
                $.ajax({
                    				
                    url:urls+'api/getExitInfo.php',
                    type: 'GET',					
					data: {
                    session:user,
                    personId:mID
                        },
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(data){		  			
					 var result =  JSON.parse(data);
					 //  alert(data);
						  console.log(result);
                      if(result){
                         console.log('GET Member Exit Info');
						   console.log(result); 

						 //  console.log('GET NOMINATED BENEFICIARIES');                  			  
                console.log(result[0]['Date of Exit']);
			 
				   var getExitInfos = setInterval(function(){ 
				  $("#tab-7").html('<a href="#">Date of Exit: </a>'+result[0]['Date of Exit']+'<br><a href="#">Date of Calculation: </a>'+result[0]['Date of Calculation']+'<br><a href="#">Date of Notification: </a>'+result[0]['Date of Notification']+'<br><a href="#">Transfer to Pension Reserve: </a>'+result[0]['Transfer to Pension Reserve']+'<br/><br/><a href="#">Insurance: </a>'+result[0]['Insurance']+'<br><a href="#">Recoveries: </a>'+result[0]['Recoveries']+'<a href="#">Recovery 1: </a>'+result[0]['Recovery 1']+'<br><a href="#">Recovery 2: </a>'+result[0]['Recovery 2']+'<br><a href="#">Fund Credit at date of Calculation: </a>'+result[0]['Fund Credit at date of Calculation']+'<br><a href="#">IRP3 Tax: </a>'+result[0]['IRP3 Tax']+'<br><a href="#">IT88 Tax: </a>'+result[0]['IT88 Tax']+'<br><a href="#">Other Tax: </a>'+result[0]['Other Tax']+'<br><a href="#">Late Interest: </a>'+result[0]['Late Interest']+'<br><a href="#">Total Lumpsum Payments: </a>'+result[0]['Total Lumpsum Payments']+ '<br><a href="#">Creditor Balance: </a>'+result[0]['Creditor Balance'] + '<br><a href="#">Payee Name: </a>'+result[0]['Payee Name']+ '<br><a href="#">Account Number: </a>'+result[0]['Account Number'] + '<br><a href="#">Date Processed: </a>'+result[0]['Date Processed'] +'<br><a href="#">Amount: </a>'+result[0]['Amount'] + '<br><a href="#">Exit Reason: </a>'+result[0]['Exit Reason']+ '<br><a href="#">Credit Balance: </a>'+result[0]['Credit Balance']+'<br>').show(); 
				        }, 2000);	
			   
			
					  	$("#loader").hide();
                          }                      
                        else{
							console.log(data);		
//
//                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
//                             $('#loader').hide();

                        }                    
                           
                    },
                    error: function(data){

                           $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
                           $('#loader').hide();
                          //$btn.button("reset");

                    }
                 

                     });
		
		}


		// GET BENEFIT STATEMENT

			 //GET Document List
		
			function getBenefitStatement(){

	       alert('test');
          //	   var sessionId = localStorage.getItem('SessionKey');
         //        var member = localStorage.getItem('personID');
         //        var UserN = localStorage.getItem('Username');
			    //  alert(user);
				var user = localStorage.getItem('SessionKey'); 				
				var mID = localStorage.getItem('mID'); 
					$('#loader').show();
                $.ajax({			
                    url:urls+'api/getBeneficiariesbase64File.php',
                    type: 'GET',					
					data: {
                    session:user,
                    personId:mID
                        },
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(data){		  			
					 var result =  JSON.parse(data);
					//  alert(result);
						  console.log(result);
                      if(result){
                         console.log('GET Benefit statement file');
						   console.log(result); 

					
                          }                      
                        else{
							console.log(data);		
//
//                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
//                             $('#loader').hide();

                        }                    
                           
                    },
                    error: function(data){

                           $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
                           $('#loader').hide();
                          //$btn.button("reset");

                    }
                 

                     });
		
		}
	
	





//
//function update_info(){
//
//var action = "get_members_details";
//var id = localStorage.getItem('industry_number');
//
//  $.post(urls+'response.php',{id:id, action:action},function(json){
//       
//       $.each(json.result,function(i,data){
//
//
//        // update form 
//
//        $("#name").val(data.name);
//        $("#surname").val(data.surname);
//        $("#dfb").val(data.dfb);
//        $("#id_number").val(data.id_number);
//        $("#industry").val(data.industry_number);
//        $("#industry_").val(data.industry_number);
//        $("#email").val(data.email);
//        $("#ids").val(data.id);
//        $("#village").val(data.village);
//        $("#employer").val(data.current_employer);
//        $("#address").val(data.address);
//        $("#mobile").val(data.mobile);
//
//
//        if (data.gender=='M') {
//
//            document.getElementById("gender").selectedIndex = "0";
//        }
//        else{
//
//           document.getElementById("gender").selectedIndex = "1";
//
//        }
//
//
//       });
// 
//  },'json');
//
//
//
//
//}


//function run_once(){ 
//    
//       var id = localStorage.getItem('industry_number'); 
//    
//        $('#loader').show();
//       
//        var action = "get_members_details";
//
//        $.post(urls+'response.php',{id:id, action:action},function(json){
//	        $.each(json.result,function(i,data){
//
//	              $("#tab-1").html('<a href="#">Name: </a>'+data.name+'<br> <a href="#">Surname: </a>'+data.surname+'<br><a href="#">Date of birth: </a>'+data.dfb+'<br><a href="#">ID number: </a>'+data.id_number+'<br><a href="#">Industry number: </a>'+data.industry_number+'<br><a href="#">Phisical address: </a>'+data.address+'<br> <a href="#">Village: </a>'+data.village+'<br> <a href="#">Contact number: </a>'+data.mobile+'<br><a href="#">Email: </a>'+data.email+'<br>').show();           
//	              $('#loader').hide();  
//
//	        });
//     
//        },'json'); 
//         
//      
//    }



// UPDATE API DETAILS

function update_member(){
 var user = localStorage.getItem('SessionKey'); 
    var surname = $('#surname').val();
    var fname = $('#fname').val();
    var cell = $('#cell').val();
    var address = $('#address').val();
    var idNumber = $('#id_number').val();
    var sessionid = localStorage.getItem('SessionKey');


	var mID = localStorage.getItem('mID');

var phoneno = /^\d{10}$/;
  


	if (cell ==''){

///alert('Please fill the Mobile Number in')
swal({
  //title: "Please Type your Mobile Number",
  text: "Please Type your Mobile Number !",
  icon: "warning",
  buttons: true,
  dangerMode: true,
})
	}else if(address ==''){

				swal({
		  //title: "Please Type your Mobile Number",
		  text: "Please Type your Physical Address !",
		  icon: "warning",
		  buttons: true,
		  dangerMode: true,
		})

//alert('Please fill the address in')
	}else if(!cell.match(phoneno))
        {
       swal({
		  //title: "Please Type your Mobile Number",
		  text: "Please Type a valid Mobile Number!",
		  icon: "warning",
		  buttons: true,
		  dangerMode: true,
		})

        }else{

	//alert(surname + fname + mID);
		$("#loader").show();
		 var values = $(this).serialize();
		 $.ajax({
		        url: "https://mwpf.co.za/mobile/server/api/updateMemberDetails.php",
		        type: "POST",
		        data: { MemberId: mID,
						Firstname: fname,      
						Surname: surname,
						idNumber : idNumber,
						cell: cell,
						sessionid : sessionid,
						address: address} ,
						dataType  : 'json',
		        success: function (response) {
		           // You will get response from your PHP page (what you echo or print)
                        if(response){
						//alert('Your update was successful');
						$("#loader").hide();
						swal({
						  title: "Your update was successful",
						  // text: "You clicked the button!",
						  icon: "success",
						});
 
                          }
		        },
		        error: function(jqXHR, textStatus, errorThrown) {
		           console.log(textStatus, errorThrown);
		        }
		    });





   
// 	$.ajax({
                   
//                     type: 'POST',
//                     data: JSON.stringify({
//                     url: 'api/updateMemberDetails.php',
//                      parameters: {
//                             SessionKey: user,
//                             MemberId: mID,
// 						 	Firstname: fname,      
// 						 	Surname: surname,
// 						 	cell: cell,
// 						 	address: address
//                             }
//                         }),
//                     contentType: 'application/json; charset=utf-8',
//                     dataType: 'json',
//                     success: function(data){
//                        // alert(data);
// 						console.log('Update user');
//                         console.log(data);
// 						$("#loader").hide();
//                     if(data.Success === true){
                           
// //                                 localStorage.setItem('SessionKey',data.SessionKey);
// //                                 localStorage.setItem('personID',data.personID);
// //                                 localStorage.setItem('MemberName',data.MemberName);
// //                                  window.location.replace("dashboard.html");
						
// 						//alert('Your update was successful');

// 												swal({
// 						  title: "Your update was successful",
// 						  // text: "You clicked the button!",
// 						  icon: "success",
// 						});
 
//                           }

                        
//                         else{



//                         $("#dialog").html('<center> '+ data.Message +' </center>').fadeIn().show().css('color', 'white');
//                         $('#loader').hide();


//                         }
                      
                           
//                     },
//                     error: function(data){

//                            $("#dialog").html('<center>Sorry Something is wrong! </center>').fadeIn().show().css('color', 'white');
//                            $('#loader').hide();
//                           //$btn.button("reset");

//                     }
                 

//                      });
}

    }



// Get the Statement

//function getStatement(){ 
//    
//    // Initialise varables
//    
//    var user = localStorage.getItem('SessionKey');
//    var name = localStorage.getItem('MemberName');
//    var memberId = localStorage.getItem('personID');
//
//    
//        $('#loader').show();
//       
//        var action = "get_members_details";
//
//        $.post(urls+'response.php',{id:id, action:action},function(json){
//	        $.each(json.result,function(i,data){
//
//	              $("#tab-1").html('<a href="#">Name: </a>'+data.name+'<br> <a href="#">Surname: </a>'+data.surname+'<br><a href="#">Date of birth: </a>'+data.dfb+'<br><a href="#">ID number: </a>'+data.id_number+'<br><a href="#">Industry number: </a>'+data.industry_number+'<br><a href="#">Phisical address: </a>'+data.address+'<br> <a href="#">Village: </a>'+data.village+'<br> <a href="#">Contact number: </a>'+data.mobile+'<br><a href="#">Email: </a>'+data.email+'<br>').show();           
//	              $('#loader').hide();  
//
//	        });
//     
//        },'json'); 
//         
//      
//    }



//function testapp(){
//	
//	alert('hi reagan');
//}
//
//
//$("p").one("click", function(){
//alert('hi reagan');
//});

	// CLEARING ALL INTERVALS
	//clearInterval(timePersonalDetails);


clearInterval(updateInfo);
clearInterval(updateInfos);
clearInterval(getstatement);
clearInterval(profile);
clearInterval(getinvestments);
clearInterval(bal);
clearInterval(getContributionRate);
clearInterval(getbeneficiaries);
clearInterval(getContributionRate);
clearInterval(getExitInfos);
clearInterval(showfile);






	

   


   





