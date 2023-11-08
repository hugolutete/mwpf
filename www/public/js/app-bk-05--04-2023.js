/**
Project: MWPF MObile APP 123
Frontend : By Mr Harly G
Backend : By Reagan M 
***/
//var urls="http://localhost/EcowebplusProjects/newapp





var urls = "https://mwpf.co.za/mobile/server/";

var url = "https://mwpf.co.za";


var session = localStorage.getItem('SessionKey');










//alert(session);

// session = null;




if (session == null) {


    window.location.replace("index.html");

}


setTimeout(function() {
    getInvestments();
}, 1000);


// A $( document ).ready() block.
$(document).ready(function() {

    // var nPassword = true;
    // alert(nPassword);
    $(".mwpf_black_").empty();

    // Display Investment balance


    var user = localStorage.getItem('SessionKey');
    var mID = localStorage.getItem('mID');

    // alert(mID);




    $.ajax({
        url: urls + 'api/investment.php',
        type: 'GET',
        data: {
            session: user,
            personID: mID
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        header: "Access-Control-Allow-Origin: *",
        success: function(res) {
            var data = JSON.parse(res);
            // console.log(result);
            console.log('SELECT INVESTMENT');
            console.log(data);
            // alert(data);
            if (data) {

                //  setTimeout(function() {
                $(".mwpf_black_").html('<bold>' + data.Investments[0].Value + '</bold>');

                //  }, 1000);

            } else {

                console.log(data);
                //
                //                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
                //                             $('#loader').hide();

            }


        },
        error: function(data) {

            $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
            $('#loader').hide();
            //$btn.button("reset");

        }

    });



















    var nPassword = localStorage.getItem('newPassword');
    if (nPassword == 'true') {

        alert('Please Update your Password to Proceed !');


        // $("#b1").click(function(){
        //  $("#profile").html('You clicked the button');
        $('.update').trigger('click');
        $('.profile').hide();
        $('.benefit').hide();
        $('.investment').hide();
        $('.ben').hide();
        $('.claim').hide();
        $('.form').hide();
        $('.unc').hide();

        // $('.profile').hide();

        // });

        // swal({
        //     //title: "Please Type your Mobile Number",
        //     text: "Please Update your Password to Proceed !",
        //     icon: "warning",
        //     buttons: true,
        //     dangerMode: true,
        // });



    } else {

        localStorage.removeItem("newPassword");
        $('.profile').trigger('click');
        // $('.update').trigger('click');
        // $('.profile').show();
        // $('.benefit').show();
        // $('.investment').show();
        // $('.ben').show();
        // $('.claim').show();
        // $('.form').show();
        // $('.unc').show();
    }

    console.log("ready!");
    var phoneno = /^\d{10}$/;
    var personId = localStorage.getItem('personID');
    var session = localStorage.getItem('SessionKey');



    var user = localStorage.getItem('SessionKey');
    var name = localStorage.getItem('MemberName');

    var personId = localStorage.getItem('personID');
    var memberId = localStorage.getItem('mID');




    if (user) {

        $(".mwpf_black").html('<bold>' + name + '</bold>');
        $('#session_1').val(localStorage.getItem('SessionKey'));
        $('#username_f').val(localStorage.getItem('personID'));

        // Get the Statement

        // REQUEST TO INVESTMENT TO GET MEMBER ID

        $.ajax({
            url: urls + 'api/getinvestments.php',
            type: 'GET',
            data: {
                session: user,
                personID: localStorage.getItem('personID')
            },
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(data) {
                var result = JSON.parse(data);

                console.log('Balance 1');
                console.log(result.Funds[0]);
                //console.log(result);
                if (result) {
                    console.log('GET MEMBER ID');


                    // console.log(data.Funds[0].Investments[0].MemberId);
                    // alert(result.Funds[0].MemberId);
                    localStorage.setItem('mID', result.Funds[0].MemberId);
                    localStorage.setItem('amountBal', result.Funds[0].InvestmentValue);
                    //alert( localStorage.getItem('mID'));
                } else {
                    console.log(data);
                }
            },
            error: function(data) {
                console.log('Error ! ');
            }
        }); // End of INVESTMENT

    } else {
        // If no session is set go to login page
        localStorage.clear("SessionKey");

    }

    //Toggle div when button is clicked 
    $('#submitUpdate').on("click", function(e) {



        var user = localStorage.getItem('SessionKey');
        var personId = localStorage.getItem('personID');
        var memberId = localStorage.getItem('mID');

        var session = $("#session_1").val();
        var userId = $("#username_f").val();
        var password = $("#n_password").val();
        var mobile = $("#mobile1").val();



        if (password == '') {

            ///alert('Please fill the Mobile Number in')
            swal({
                //title: "Please Type your Mobile Number",
                text: "Please Type Your Password",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
        } else if (mobile == '') {

            swal({
                //title: "Please Type your Mobile Number",
                text: "Please Type your Mobile Number",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })

            //alert('Please fill the address in')
        } else if (!mobile.match(phoneno)) {
            swal({
                //title: "Please Type your Mobile Number",
                text: "Please Type a valid Mobile Number",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })

        } else {



            $.ajax({
                url: urls + "api/updatePassword.php",
                type: "POST",
                data: { session: session, userId: personId, password: password, mobile: mobile },
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded',
                success: function(response) {

                    // var data = JSON.parse(response);
                    console.log(response);
                    var data = JSON.parse(JSON.stringify(response));

                    //console.log(data);


                    if (data.status === 'success') {

                        alert(data.message);
                        window.location = "index.html";
                    } else if (data.status === "error") {

                        alert(data.message);

                    }
                    // alert(response.message);


                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // console.log(textStatus, errorThrown);
                }
            });

        }
    });


});



function logout() {


    //var nPassword = new Boolean();

    var nPassword = localStorage.getItem('newPassword');
    // alert(nPassword);

    if (nPassword === 'true') {

        alert('Please Update your Password to Proceed !');

        $('.update').trigger('click');

        //   return false;


    } else if (nPassword === 'false') {


        // localStorage.clear("industry_number");
        localStorage.clear();
        sessionStorage.clear();
        var user = localStorage.clear('SessionKey');
        var name = localStorage.clear('MemberName');
        var memberId = localStorage.clear('personID');
        $("#logged").hide();
        //emptyDivs();
        window.location = "index.html";

    } else
    if (nPassword === null) {

        window.location = "index.html";
    }
}


function emptyDivs() {
    $("#profile").empty();
}







// GET BENEFIT STATEMENT

//GET Document List

function getBenefitStatement() {


    //	alert('test');
    //	   var sessionId = localStorage.getItem('SessionKey');
    //        var member = localStorage.getItem('personID');
    //        var UserN = localStorage.getItem('Username');
    //  alert(user);
    var user = localStorage.getItem('SessionKey');
    var mID = localStorage.getItem('mID');
    $('#loader').show();
    $.ajax({
        url: urls + 'api/getBeneficiariesbase64File.php',
        type: 'GET',
        data: {
            session: user,
            personId: mID
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
            var result = JSON.parse(data);
            //  alert(result);
            console.log(result);
            if (result) {
                console.log('GET Benefit statement file');
                console.log(result);

                //          setTimeout(function(){
                // showfile();	
                //             }, 1000);

            } else {
                console.log(data);
                //
                //                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
                //                             $('#loader').hide();

            }

        },
        error: function(data) {

            $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
            $('#loader').hide();
            //$btn.button("reset");

        }


    });

}

//Function Update Password





//GET Document List

function getExitInfo() {

    //	   var sessionId = localStorage.getItem('SessionKey');
    //        var member = localStorage.getItem('personID');
    //        var UserN = localStorage.getItem('Username');
    //  alert(user);
    var user = localStorage.getItem('SessionKey');
    var mID = localStorage.getItem('mID');
    $('#loader').show();
    $.ajax({

        url: urls + 'api/getExitInfo.php',
        type: 'GET',
        data: {
            session: user,
            personId: mID
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
            var result = JSON.parse(data);
            //  alert(data);
            console.log(result);
            if (result) {
                console.log('GET Member Exit Info');
                console.log(result);

                //  console.log('GET NOMINATED BENEFICIARIES');
                console.log(result[0]['Date of Exit']);

                var getExitInfos = setTimeout(function() {


                    $.each(result, function(key, dat) {

                        $("#exit").html('<li><div class="table_section">Date of Exit: </div><div class="table_section"><b>' + dat['Date of Exit'] + '</b></div></li><li><br>');
                        //$("#exit").html('<li><div class="table_section">Date of Exit: </div><div class="table_section"><b>' +dat.['Date of Exit']+'</b></div></li><li><div class="table_section">Recovery 2: </div><div class="table_section"><b>' +dat.['Recovery 2']+'</b></div></li><li><div class="table_section">IRP3 Tax: </div><div class="table_section"><b>' +dat.['IRP3 Tax']+'</b></div></li><li><div class="table_section">Total Lumpsum Payments: </div><div class="table_section"><b>' +dat.['Total Lumpsum Payments']+'</b></div></li><li><div class="table_section">Creditor Balance: </div><div class="table_section"><b>' +dat.['Creditor Balance']+'</b></div></li><li><div class="table_section">Payee Name: </div><div class="table_section"><b>' +dat.['Payee Name']+'</b></div></li><li><div class="table_section">Account Number: </div><div class="table_section"><b>' +dat.['Account Number']+'</b></div></li><li><div class="table_section">Exit Reason: </div><div class="table_section"><b>' +dat.['Exit Reason']+'</b></div></li><li><div class="table_section">Credit Balance: </div><div class="table_section"><b>' +dat.['Credit Balance']+'</b></div></li><br>');


                        //$("#tab-5").append('<a href="#">EffectiveDate: </a>'+dat.EffectiveDate+'<br><a href="#">Firstname: </a>'+dat.Firstname+'<br><a href="#">Surname: </a>'+dat.Surname+'<br><a href="#">IDNumber: </a>'+dat.IDNumber+'<br/><br/><a href="#">DateOfBirth: </a>'+dat.DateOfBirth+'<br><a href="#">Gender: </a>'+dat.Gender+'<br><a href="#">Phonenumber: </a>'+dat.Phonenumber+'<br><a href="#">Address: </a>'+dat.Address+'<br><a href="#">BankAccount: </a>'+dat.BankAccount+'<br><a href="#">BankAccountHolder: </a>'+dat.BankAccountHolder+'<br><a href="#">BranchCode: </a>'+dat.BranchCode+'<br><a href="#">BranchName: </a>'+dat.BranchName+'<br><a href="#">BankName: </a>'+dat.BankName+'<br><a href="#">BeneficiaryType: </a>'+dat.BeneficiaryType+ '<br><a href="#">Percentage: </a>'+dat.Percentage+'<br><h3>----------------------------------------------</h3><br>').show();
                    });
                    // $("#tab-5").html(string);
                }, 1000);

                //$("ul#contribution").html('<li><div class="table_section">Date of Exit: </div><div class="table_section"><b>' +result[0].EEDeemedFixed+'</b></div></li><li><div class="table_section">EEFixed: </div><div class="table_section"><b>' +result[0].EEFixed+'</b></div></li><li><div class="table_section">Effective Date: </div><div class="table_section"><b>'+result[0].EffectiveDate+'</b></div></li><li><div class="table_section">ER Fixed: </div><div class="table_section"><b>'+result[0].ERFixed+'</b></div></li><li><div class="table_section">Esc Percentage: </div><div class="table_section"><b>'+result[0].EscPercentage+'</b></div></li><br><br>')



                $("#loader").hide();
            } else {
                console.log(data);
                //
                //                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
                //                             $('#loader').hide();

            }

        },
        error: function(data) {

            $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
            $('#loader').hide();
            //$btn.button("reset");

        }


    });

}


//GET BENEFICIARIES

function getBeneficiaries() {

    //	   var sessionId = localStorage.getItem('SessionKey');
    //        var member = localStorage.getItem('personID');
    //        var UserN = localStorage.getItem('Username');
    //  alert(user);
    var user = localStorage.getItem('SessionKey');
    var mID = localStorage.getItem('mID');


    $('#loader').show();
    $.ajax({

        url: urls + 'api/getNominatedBeneficiaries.php',
        type: 'GET',
        data: {
            session: user,
            personId: mID
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
            var result = JSON.parse(data);
            console.log('GET NOMINATED BENEFICIARIES 1st');
            console.log(result);

            if (result) {
                console.log('GET NOMINATED BENEFICIARIES');
                //   var results= $.parseJSON(result);
                //   console.log(results);
                //  console.log('GET NOMINATED BENEFICIARIES');

                var getbeneficiaries = setTimeout(function() {
                    // var result= $.parseJSON(result);

                    //  var string = "<ul>";

                    /* from result create a string of data and append to the div */

                    $.each(result, function(key, dat) {
                        // key + ':' +dat.Firstname;
                        //console.log(value['IDNumber']);
                        // console.log(dat['Firstname']);
                        // console.log(result[0].EffectiveDate);
                        //         dat['Firstname'];

                        console.log('First Name :' + dat['Firstname']);

                        //$('#tab-5').append('First Name :'  +dat['Firstname']);
                        //  list = dat['IDNumber'];

                        // $("#tab-5").html("<ul><li>"+value['IDNumber']+"</li></ul>");

                        //alert(key, dat['IDNumber']);

                        //$("#tab-5").html(dat['IDNumber']);
                        //$("#tab-5").append('<a href="#">EffectiveDate: </a>'+dat.EffectiveDate+'<br><a href="#">Firstname: </a>'+dat.Firstname+'<br><a href="#">Surname: </a>'+dat.Surname+'<br><a href="#">IDNumber: </a>'+dat.IDNumber+'<br/><br/><a href="#">DateOfBirth: </a>'+dat.DateOfBirth+'<br><a href="#">Gender: </a>'+dat.Gender+'<br><a href="#">Phonenumber: </a>'+dat.Phonenumber+'<br><a href="#">Address: </a>'+dat.Address+'<br><a href="#">BankAccount: </a>'+dat.BankAccount+'<br><a href="#">BankAccountHolder: </a>'+dat.BankAccountHolder+'<br><a href="#">BranchCode: </a>'+dat.BranchCode+'<br><a href="#">BranchName: </a>'+dat.BranchName+'<br><a href="#">BankName: </a>'+dat.BankName+'<br><a href="#">BeneficiaryType: </a>'+dat.BeneficiaryType+ '<br><a href="#">Percentage: </a>'+dat.Percentage+'<br><h3>----------------------------------------------</h3><br>').show();
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
            } else {
                console.log(data);
                //
                //                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
                //                             $('#loader').hide();
            }
        },
        error: function(data) {

            $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
            $('#loader').hide();
            //$btn.button("reset");

        }


    });
    //clearInterval(getbeneficiaries);

}



//GET CONTRIBUTION RATE

function getContributionRate() {

    //	    var sessionId = localStorage.getItem('SessionKey');
    //      var member = localStorage.getItem('personID');
    //      var UserN = localStorage.getItem('Username');
    //  alert(user);
    var user = localStorage.getItem('SessionKey');
    var mID = localStorage.getItem('mID');
    $('#loader').show();
    $.ajax({

        url: urls + 'api/getContributionRate.php',
        type: 'GET',
        data: {
            session: user,
            personId: mID
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        header: "Access-Control-Allow-Origin: *",
        success: function(data) {
            var result = JSON.parse(data);
            console.log(result);
            //alert(result[0].MemberID);
            //  alert(result);
            if (result) {
                console.log('GET CONTRIBUTION RATE');
                //console.log(result.Funds[0].InvestmentDate);


                $("ul#contribution").html('<li><div class="table_section">EEDeemedFixed: </div><div class="table_section"><b>' + result[0].EEDeemedFixed + '</b></div></li><li><div class="table_section">EEFixed: </div><div class="table_section"><b>' + result[0].EEFixed + '</b></div></li><li><div class="table_section">Effective Date: </div><div class="table_section"><b>' + result[0].EffectiveDate + '</b></div></li><li><div class="table_section">ER Fixed: </div><div class="table_section"><b>' + result[0].ERFixed + '</b></div></li><li><div class="table_section">Esc Percentage: </div><div class="table_section"><b>' + result[0].EscPercentage + '</b></div></li><br><br>')

                //console.log('Contribution Rate');
                //	$("#contribution").html('<li><div class="table_section">EEDeemedFixed: </div><div class="table_section"><b>' +result[0].+'</b></div></li><li><div class="table_section">EEFixed: </div><div class="table_section"><b>'+data.Investments[0].Product+'</b></div></li><li><div class="table_section">Units: </div><div class="table_section"><b>'+data.Investments[0].Units+'</b></div></li><li><div class="table_section">Price: </div><div class="table_section"><b>'+data.Investments[0].Price+'</b></div></li><li><div class="table_section">Value: </div><div class="table_section"><b>'+data.Investments[0].Value+'</b></div></li></b></div><div class="table_section"></div><div class="table_section"><b></b></div><br><br>');

                //$("#contribution").append('<br><a href="#">EEFixed: </a>'+result[0].EEFixed+'<br><a href="#">EERate: </a>'+result[0].EERate+'<br/><br/><a href="#">ERFixed: </a>'+result[0].ERFixed+'<br><a href="#">ERRate: </a>'+result[0].ERRate+'<br><a href="#">EffectiveDate: </a>'+result[0].EffectiveDate+'<br><a href="#">EscDate: </a>'+result[0].EscDate+'<br><a href="#">EscPercentage: </a>'+result[0].EscPercentage+'<br><a href="#">FromAge: </a>'+result[0].FromAge+'<br><a href="#">ToAge: </a>'+result[0].ToAge+'<br>');

                $("#loader").hide();
            } else {
                console.log(data);
                //
                //                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
                //                             $('#loader').hide();

            }

        },
        error: function(data) {

            $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
            $('#loader').hide();
            //$btn.button("reset");

        }


    });

}




//GET STATEMENT

function getStatementd() {

    //	   var sessionId = localStorage.getItem('SessionKey');
    //        var member = localStorage.getItem('personID');
    //        var UserN = localStorage.getItem('Username');
    //  alert(user);
    var user = localStorage.getItem('SessionKey');
    var mID = localStorage.getItem('mID');
    $('#loader').show();
    $.ajax({

        url: urls + 'api/getStatementv2.php',
        type: 'GET',
        data: {
            session: user,
            personId: mID
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        header: "Access-Control-Allow-Origin: *",
        success: function(data) {
            var result = JSON.parse(data);
            console.log(result);
            if (result) {
                console.log('GET STATEMENT V2');
                console.log(result['LastContributions']['ContributionTotal']);




                var getstatement = setTimeout(function() {
                    $("#tab-2").html('<a href="#">Statement Date: </a>' + result['StatementDate'] +
                        '<br> <a href="#">Last Annual Salary: </a>' + result['LastAnnualSalary'] + '<br><a href="#">Category: </a>' + result['Category'] + '<br><a href="#">Paypoint: </a>' + result['Paypoint'] + '<br><a href="#">Employer Name: </a>' + result['EmployerName'] + '<br><a href="#">Last Risk Salary: </a>' + result['LastRiskSalary'] + '<br/><br/><a href="#">Withdrawal: </a>' + result['Benefit']['Withdrawal'] + '<br><a href="#">Death: </a>' + result['Benefit']['Death'] + '<br><a href="#">Retirement: </a>' + result['Benefit']['Retirement'] + '<br><a href="#">Date Of Exit: </a>' + result['Benefit']['DateOfExit'] + '<br><a href="#">Last Contribution Date: </a>' + result['LastContributions']['LastContributionDate'] + '<br><a href="#">Contribution Total: </a>' + result['LastContributions']['ContributionTotal'] + '<br>').show();
                }, 2000);


                $("#loader").hide();
            } else {
                console.log(data);
                //
                //                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
                //                             $('#loader').hide();

            }

        },
        error: function(data) {

            $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
            $('#loader').hide();
            //$btn.button("reset");

        }


    });

}



// GET INVESTMENT DETAILS
function getInvestments() {

    //	   var sessionId = localStorage.getItem('SessionKey');
    //        var member = localStorage.getItem('personID');
    //        var UserN = localStorage.getItem('Username');

    var user = localStorage.getItem('SessionKey');
    var mID = localStorage.getItem('mID');

    // alert(mID);

    $.ajax({
        url: urls + 'api/investment.php',
        type: 'GET',
        data: {
            session: user,
            personID: mID
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        header: "Access-Control-Allow-Origin: *",
        success: function(res) {
            var data = JSON.parse(res);
            // console.log(result);
            console.log('SELECT INVESTMENT');
            console.log(data);
            // alert(data);
            if (data) {
                //alert(data.Investments[0].InvestmentDate);
                //$(".mwpf_black_").html('<bold>'+result.CurrentTotalValue+'</bold>');
                // alert(result.Investments[0].InvestmentDate);
                // $("#tab-3").html('<a href="#">Date: </a>'+result.Investments[0].InvestmentDate+'<br/><a href="#">Product: </a>'+result.Investments[0].Product+
                // 	'<br> <a href="#">Units: </a>'+result.Investments[0].Units+'<br><a href="#">Price: </a>'+result.Investments[0].Price+'<br><a href="#">Value: </a>'+result.Investments[0].Value+'<br>').show();


                $("#investmentInfo").html('<li><div class="table_section">Date: </div><div class="table_section"><b>' + data.Investments[0].InvestmentDate + '</b></div></li><li><div class="table_section">Product: </div><div class="table_section"><b>' + data.Investments[0].Product + '</b></div></li><li><div class="table_section">Units: </div><div class="table_section"><b>' + data.Investments[0].Units + '</b></div></li><li><div class="table_section">Price: </div><div class="table_section"><b>' + data.Investments[0].Price + '</b></div></li><li><div class="table_section">Value: </div><div class="table_section"><b>' + data.Investments[0].Value + '</b></div></li></b></div><div class="table_section"></div><div class="table_section"><b></b></div><br><br>');

                // localStorage.setItem('SessionKey',data.SessionKey);
                //localStorage.setItem('personID',data.personID);
                // localStorage.setItem('MemberName',data.MemberName);
                //  window.location.replace("dashboard.html");
            } else {

                console.log(data);
                //
                //                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
                //                             $('#loader').hide();

            }


        },
        error: function(data) {

            $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
            $('#loader').hide();
            //$btn.button("reset");

        }

    });
}


// GET FUND BALANCE
function getBalance() {
    //	   var sessionId = localStorage.getItem('SessionKey');
    //        var member = localStorage.getItem('personID');
    //        var UserN = localStorage.getItem('Username');
    var user = localStorage.getItem('SessionKey');
    var mID = localStorage.getItem('personID');

    $.ajax({
        url: urls + 'api/getinvestments.php',
        type: 'GET',
        data: {
            session: user,
            personID: localStorage.getItem('personID')
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(res) {
            console.log('GET BALANCE');
            // var result = JSON.parse(res);

            // alert(res);
            var data = JSON.parse(res);
            console.log(data);

            //res = JSON.stringify(data);				
            //alert(data.Funds[0].InvestmentValue);
            //console.log(res);
            //alert(res);
            if (data) {

                //console.log(data['Funds'][0].InvestmentValue);


                var amount = data.Funds[0].InvestmentValue;
                var total = amount.toString().match(/^\d+(?:\.\d{0,2})?/);
                //  alert(amount.toString().match(/^\d+(?:\.\d{0,2})?/));





                // localStorage.setItem('SessionKey',data.SessionKey);
                //localStorage.setItem('personID',data.personID);
                // localStorage.setItem('MemberName',data.MemberName);
                //  window.location.replace("dashboard.html");
            } else {

                console.log(data);
                //
                //                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
                //                             $('#loader').hide();

            }


        },
        error: function(data) {

            $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
            $('#loader').hide();
            //$btn.button("reset");

        }


    });

}







function UpdatePersonalData() {


    var user = localStorage.getItem('SessionKey');
    var mID = localStorage.getItem('mID');


    var mobile = $('#updateMobile').val();
    var address = $('#updateAddress').val();

    $.ajax({

        url: urls + 'api/detailsUpdates.php',
        type: 'POST',
        data: {
            personId: mID,
            mobileN: mobile,
            addressN: address
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(res) {
            var data = JSON.parse(res);
            console.log(result);
            console.log(data);
            // console.log(result.Name);
            //alert(result);
            alert(res);
            // var test = new Object();

            if (data) {
                console.log('GET MORE  DETAILS');
                console.log(res);

                //$.each(json.result,function(i,data){

                var updateInfos = setTimeout(function() {

                    // $("#address").val('hi there');
                    // $("#mobile").val(data);
                }, 1000);



                // });
                //	              $('#loader').hide();

            } else {

                console.log(data);
                //
                //                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
                //                             $('#loader').hide();

            }


        },
        error: function(data) {

            //                           $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
            //                           $('#loader').hide();
            //$btn.button("reset");

        }


    });


}


function UpdatePersonalinfo() {
    //alert('it works');
    //	   var sessionId = localStorage.getItem('SessionKey');
    //        var member = localStorage.getItem('personID');
    //        var UserN = localStorage.getItem('Username');
    //  alert(user);
    var user = localStorage.getItem('SessionKey');
    var mID = localStorage.getItem('mID');
    $.ajax({

        url: urls + 'api/getPersonalDetails.php',
        type: 'GET',
        data: {
            session: user,
            personId: mID
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(res) {
            var data = JSON.parse(res);
            //	console.log(result);
            // console.log(result.Name);
            //alert(result);
            //	alert(res);
            // var test = new Object();

            if (data) {
                console.log('GET PERSONAL DETAILS');
                //console.log(result.Surname);

                //$.each(json.result,function(i,data){

                var updateInfo = setTimeout(function() {
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

            } else {

                console.log(data);
                //
                //                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
                //                             $('#loader').hide();

            }


        },
        error: function(data) {

            //                           $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
            //                           $('#loader').hide();
            //$btn.button("reset");

        }


    });


}



function personalinfo() {
    //alert('it works');
    //	   var sessionId = localStorage.getItem('SessionKey');
    //        var member = localStorage.getItem('personID');
    //        var UserN = localStorage.getItem('Username');
    //  alert(user);
    var user = localStorage.getItem('SessionKey');
    var mID = localStorage.getItem('personID');

    //alert(localStorage.getItem('mID'));
    $.ajax({
        url: urls + 'api/getPersonalDetails.php',
        type: 'GET',
        data: {
            session: user,
            personId: localStorage.getItem('mID')
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(res) {
            var data = JSON.parse(res);
            //console.log(res[0]);
            //  var myJSON = JSON.stringify(data);
            console.log(data.DateJoinedFund);
            //alert(data.DateJoinedFund);
            // var test = new Object();

            if (res) {
                console.log('GET PERSONAL INFO');
                //console.log(result.Surname);
                // alert(data.Details.Firstname);
                //$.each(json.result,function(i,data){


                //	$("#tab-1").html('<a href="#">Firstname: </a>'   +data.Details.Firstname+'<br> <a href="#">Surname: </a>'   +data.Details.Surname+'<br><a href="#">Date of birth: </a>'   +data.Details.DateOfBirth+'<br><a href="#">ID number: </a>'   +data.Details.IDNumber+'<br><a href="#">Date Joined Fund: </a>'   +data.Details.DateJoinedFund+'<br><a href="#">Date Pensionnable Fee: </a>'   +data.Details.DatePensionableService+'<br> <a href="#">Normal Retirement Date: </a>'+data.Details.NormalRetirementDate+'<br> <a href="#">Date Exit: </a>'   +data.Details.DateOfExit+'<br><a href="#">Member No: </a>'   +data.Details.MemberNo+'<br>').show();
                //	$("#tab-1").html('<a href="#">Firstname: </a>'   +data.Details.Firstname+'<br> <a href="#">Surname: </a>'   +data.Details.Surname+'<br><a href="#">Date of birth: </a>'   +data.Details.DateOfBirth+'<br><a href="#">ID number: </a>'   +data.Details.IDNumber+'<br><a href="#">Date Joined Fund: </a>'   +data.Details.DateJoinedFund+'<br><a href="#">Date Pensionnable Fee: </a>'   +data.Details.DatePensionableService+'<br> <a href="#">Normal Retirement Date: </a>'   +data.Details.NormalRetirementDate+'<br> <a href="#">Date Exit: </a>'   +data.Details.DateOfExit+'<br><a href="#">Member No: </a>'   +data.Details.MemberNo+'<br>').show();
                $("ul#profile").html('<li><div class="table_section">Firstname: </div><div class="table_section"><b>' + data.Firstname + '</b></div></li><li><div class="table_section">Surname: </div><div class="table_section"><b>' + data.Surname + '</b></div></li><li><div class="table_section">Date of birth: </div><div class="table_section"><b>' + data.DateOfBirth + '</b></div></li><li><div class="table_section">ID number: </div><div class="table_section"><b>' + data.IDNumber + '</b></div></li><li><div class="table_section">Date Joined Fund: </div><div class="table_section"><b>' + data.DateJoinedFund + '</b></div></li><li><div class="table_section">Date Pensionnable Fee: </div><div class="table_section"><b>' + data.DatePensionableService + '</b></div></li><li><div class="table_section">Normal Retirement Date: </div><div class="table_section"><b>' + data.NormalRetirementDate + '</b></div></li><li><div class="table_section">Date Exit: </div><div class="table_section"><b>' + data.DateOfExit + '</b></div></li><li><div class="table_section">Member No: </div><div class="table_section"><b>' + data.MemberNo + '</b></div></li><li></li></b></div><div class="table_section"></div><div class="table_section"><b></b></div><br><br>')
                    //console.log(data.Details.MemberNo);

                // });
                //	              $('#loader').hide();

            } else {

                console.log(data);
                //
                //                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
                //                             $('#loader').hide();

            }


        },
        error: function(data) {

            //                           $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
            //                           $('#loader').hide();
            //$btn.button("reset");

        }


    });


} // END OF GET PERSONAL DETAILS


// GET PERSONAL DETAILS


function getBenefitStatementFile() {

    // alert('test');
    //	   var sessionId = localStorage.getItem('SessionKey');
    //        var member = localStorage.getItem('personID');
    //        var UserN = localStorage.getItem('Username');
    //  alert(user);
    var user = localStorage.getItem('SessionKey');
    var mID = localStorage.getItem('mID');



    $('#loader').show();
    $.ajax({
        url: urls + 'api/getBeneficiariesbase64File.php',
        type: 'GET',
        data: {
            session: user,
            personId: mID
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
            var result = JSON.parse(data);
            //alert(data);
            console.log(result);
            if (result) {
                console.log('GET Benefit statement file');
                console.log(result);

                //	 var bstatement = setInterval(function(){

                if (memberId === null) {

                    alert('No file available');

                } else {

                    $("#bstatement").append('<br><br><a href="' + url + '/mobile/server/api/statements/doc/' + memberId + '".pdf">View Benefit Statement</a><br><br>').show();

                }

                console.log(data.Details.MemberNo);

                //	   }, 1000);

            } else {
                console.log(data);


                //
                //                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
                //                             $('#loader').hide();

            }

        },
        error: function(data) {

            $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
            $('#loader').hide();
            //$btn.button("reset");

        }


    });

    openBenefitStatement();
}

function openBenefitStatement() {
    //alert('test');

    var memberId = localStorage.getItem('mID');
    var file = memberId + ".pdf";
    var path = url + '/mobile/server/api/statements/doc/' + file;

    if (memberId != '') {
        showfile = setTimeout(function() {

            if (memberId != '') {
                var html = "<br><a href=" + path + "> View Benefit Statement </a><br>";


            } else {

                alert('Sory, File not Available');

            }


            $('#bstatement').html(html);
        }, 1000);

    } else {
        showfile = setInterval(function() {
            var html = "<br><a href='#'>Benefit Statement Not Available</a><br>";
            $('#bstatement').html(html);
        }, 1000);
    }


}


//GET BENEFICIARIES

function getBeneficiaries() {

    //	   var sessionId = localStorage.getItem('SessionKey');
    //        var member = localStorage.getItem('personID');
    //        var UserN = localStorage.getItem('Username');
    //  alert(user);
    var user = localStorage.getItem('SessionKey');
    var mID = localStorage.getItem('mID');
    $('#loader').show();
    $.ajax({

        url: urls + 'api/getNominatedBeneficiaries.php',
        type: 'GET',
        data: {
            session: user,
            personId: mID
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
            var result = JSON.parse(data);
            console.log('GET NOMINATED BENEFICIARIES 1st');
            console.log(result);

            if (result) {
                console.log('GET NOMINATED BENEFICIARIES');
                //   var results= $.parseJSON(result); 
                //   console.log(results); 
                //  console.log('GET NOMINATED BENEFICIARIES');                  			  

                var getbeneficiaries = setTimeout(function() {
                    // var result= $.parseJSON(result); 

                    //  var string = "<ul>";

                    /* from result create a string of data and append to the div */

                    $.each(result, function(key, dat) {
                        // key + ':' +dat.Firstname; 
                        //console.log(value['IDNumber']);
                        // console.log(dat['Firstname']); 
                        // console.log(result[0].EffectiveDate);
                        //         dat['Firstname']; 

                        console.log('First Name :' + dat['Firstname']);
                        $("#tab-5").append('<a href="#">EffectiveDate: </a>' + dat.EffectiveDate + '<br><a href="#">Firstname: </a>' + dat.Firstname + '<br><a href="#">Surname: </a>' + dat.Surname + '<br><a href="#">IDNumber: </a>' + dat.IDNumber + '<br/><br/><a href="#">DateOfBirth: </a>' + dat.DateOfBirth + '<br><a href="#">Gender: </a>' + dat.Gender + '<br><a href="#">Phonenumber: </a>' + dat.Phonenumber + '<br><a href="#">Address: </a>' + dat.Address + '<br><a href="#">BankAccount: </a>' + dat.BankAccount + '<br><a href="#">BankAccountHolder: </a>' + dat.BankAccountHolder + '<br><a href="#">BranchCode: </a>' + dat.BranchCode + '<br><a href="#">BranchName: </a>' + dat.BranchName + '<br><a href="#">BankName: </a>' + dat.BankName + '<br><a href="#">BeneficiaryType: </a>' + dat.BeneficiaryType + '<br><a href="#">Percentage: </a>' + dat.Percentage + '<br><h3>----------------------------------------------</h3><br>').show();
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
            } else {
                console.log(data);
                //
                //                             $("#dialog").html('<center> '+ data.message +' </center>').show().css('color', 'red');
                //                             $('#loader').hide();
            }
        },
        error: function(data) {

            $("#dialog").html('<center>Sorry Something is wrong! </center>').show().css('color', 'red');
            $('#loader').hide();
            //$btn.button("reset");

        }


    });
    //clearInterval(getbeneficiaries);

}




getBalance();
personalinfo();
getBenefitStatementFile();
// showfile();
//getStatementd();


// END OG GET BALANCE FUNCTION
// GET BALANCE
//UpdatePersonalinfo();
//UpdatePersonalData();
// Get balance
// getBalance() ;
//var statement = getStatementd();
//GET PERSONAL DETAILS
// Get Statement

// GET PERSONAL DETAILS
//Get investment
//getInvestments();
getContributionRate();
getExitInfo();
getBeneficiaries();
getBenefitStatement();


//localStorage.removeItem("newPassword");
//clearInterval(updateInfo);
//clearInterval(updateInfos);
clearInterval(getstatement);
clearInterval(profile);
clearInterval(getinvestments);
clearInterval(bal);
clearInterval(getContributionRate);
clearInterval(getbeneficiaries);
clearInterval(getContributionRate);
clearInterval(getExitInfos);
clearInterval(showfile);