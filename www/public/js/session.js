/**
Project: MWPF MObile APP
Frontend : By Mr Harly G
Backend : By Reagan M 
***/
//var urls="http://localhost/EcowebplusProjects/newapp

//alert('session');


var urls = "https://mwpf.co.za/mobile/server/";


function hideProfile() {
    $("#loggedIn").hide();
}


function defaultReg() {


    window.open('pdf/defaultregulations.pdf', '_blank');
}

function guide() {

    //alert('Hi');
    window.open('var urls = "https://mwpf.co.za/mobile/www/pdf/memberguide.pdf', '_blank');

    //  window.location="https://mwpf.co.za/mobile/www/pdf/memberguide.pdf";


}

function viewProfile() {
    //console.log('hi');
    window.location.replace('profile.html');
    //window.open('profile.html');
    //location.reload('profile.html'); 
}



function nomination() {

    window.open('var urls = "https://mwpf.co.za/mobile/www/pdf/membernomination.pdf', '_blank');

}


// A $( document ).ready() block.
$(document).ready(function() {
    console.log("ready!");
    var phoneno = /^\d{10}$/;
    hideProfile();
    $("#selectQuestion").hide();
    $("#labelOpt").hide();
    $("#btnProceed").hide();
    // COUPON FUNCTIONS






    $(function() {
        $('#selectQuestion').on('change', function(event) {
            console.log(event.type + " event with:", $(this).val());
            //  $(this).prev('input').val($(this).val());

            //  alert($(this).val());

            // alert(localStorage.getItem('userID'));


            localStorage.setItem('userAnswer', $(this).val());

            if ($(this).val() === true) {

                //  $('#btnRegister').prop('disabled', false);
                $('#btnRegister').show();
                //  alert(localStorage.getItem('userID'));

                // alert($(this).val() + 'True');

            } else {

                $('#btnRegister').prop('disabled', true);
                // $('#btnRegister').hide();
                // alert($(this).val());
                alert($(this).val());
            }


        });
    });




    // FORGOT PASSWORD
    $("#btnRecovery").click(function() {

        // console.log('fired recovery');


        var userName = $("#username_f").val();
        //  var pass = $("#password").val(); 
        // alert(userName);

        if ($('#username_f').val() === null) {

            // $("#dialog").html('<center> Please enter your Cell Number !</center>').show().css('color', 'white');
            // $('input[name=cellno]').css('border-color', '#e41919');
            alert('Please type your Mobile App Username');

            // swal({
            //     title: "Please Type your Mobile Number",
            //     text: "Please enter your Cell Number ",
            //     icon: "warning",
            //     buttons: true,
            //     dangerMode: true,
            // });



            // $('#recover').hide();
            //$("#loginSpace").hide();

        } else {
            // $('#loader').show();         

            $.ajax({
                url: "https://mwpf.co.za/mobile/server/api/recovery.php",
                type: "POST",
                data: { user: userName },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: function(response) {

                    // var data = JSON.parse(response);
                    console.log(response);
                    var data = JSON.parse(JSON.stringify(response));

                    //console.log(data);


                    if (data.status === 'success') {

                        alert(data.message);
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

    $("#guide").hide();

    // LOGIN
           function show_loading()
{
   document.getElementById("btnLogin").value = "Loading .....";
   // 
}
    $("#btnLogin").click(
        function() {
        var usu = $("#username").val();
        var pass = $("#password").val();
        $("#btnLogin").val("Loading .....");
        if ($('#username').val() == "" && $('#password').val() == "") {

            swal({
                //title: "Please Type your Mobile Number",
                text: "Please Enter Your Login Details",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            $("#btnLogin").val("SIGN IN");

            $("#loginSpace").hide();

        } else
        if ($('#username').val() == "")

        {

            swal({
                //title: "Please Type your Mobile Number",
                text: "Please Enter Your Industry Number",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            $("#btnLogin").val("SIGN IN");

        } else
        if ($('#password').val() == "") {

            swal({
                //title: "Please Type your Mobile Number",
                text: "Please Enter Your Password",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            $("#btnLogin").val("SIGN IN");


            $("#loginSpace").hide();

        } else {
            $('#loader').show();

            $.ajax({

                url: urls + 'api/login.php',
                type: 'POST',
                data: JSON.stringify({
                    url: 'https://mobile.mwpf.co.za/api/Loginv2',
                    usernames: usu,
                    parameters: {
                        Username: usu,
                        Password: pass
                    }
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(data) {
                    // alert(data.Message);
                    console.log(data);
                    if (data.Authenticated === true) {

                        localStorage.setItem('SessionKey', data.SessionKey);
                        localStorage.setItem('personID', data.UserID);
                        localStorage.setItem('MemberName', data.Surname);
                        localStorage.setItem('newPassword', data.NewPasswordRequired);
                        // localStorage.setItem('userName', $('#username').val());
                        // alert(localStorage.getItem('personID'));
                        // window.location.replace("dashboard.html");


                        swal({
                            //title: "Please Type your Mobile Number",
                            text: "You are Logged In",
                            icon: "success",
                            buttons: true,
                            dangerMode: false,
                        });

                        $('#loginmenu').hide();
                        $('#signin').hide();
                        $('#emp').hide();
                        $("#loginSpace").hide();
                        $("#loggedIn").show();
                        $("#logged").show();
                        $("#guide").show();
                    } else if (data.Authenticated === false) {


                        swal({
                            //title: "Please Type Your Mobile Number",
                            text: "Invalid Credentials !",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                        })
                        $("#btnLogin").val("SIGN IN");
                        $("#logged").hide();
                        $("#loginSpace").hide();
                    }

                },
                error: function(data) {

					alert("Error");
                    swal({
                        //title: "Please Type your Mobile Number",
                        text: "Something went wrong !",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                    $("#btnLogin").val("SIGN IN");
                    $("#logged").hide();
                }

            });
        }

        $("#btnLogin").val("SIGN IN");
    });


    // REGISTRATION FORM


    $("#btnRegister").click(function() {

        //  $("#btnRegister").hide();

        //  $("#loginSpace").hide();


 
        $("#btnRegister").val("Loading .....");
        var surname = $("#surname").val();
        var industryNumber = $("#industryNo").val();
        var mobile = $("#mobile").val();


        if (surname == "") {

            alert('Please type the surname !');
            $("#btnRegister").val("SIGN UP");
            return false;

        } else if (industryNumber == "") {

            alert('Please type the industry number !');
            $("#btnRegister").val("SIGN UP");
            return false;

        } else if (mobile == "") {

            alert('Please type the mobile number !');
            $("#btnRegister").val("SIGN UP");
            return false;

        } else {


            // exit();


            //  alert(industryNumber);
            $('#loader').show();

            $.ajax({

                url: urls + 'api/verify.php',
                type: 'POST',
                data: JSON.stringify({
                    url: 'https://mobile.mwpf.co.za/api/VerifyMember',
                    parameters: {
                        surname: surname,
                        LookupValue: industryNumber,
                    }
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(data) {
                    // alert(data.Message);
                    // $("#question").show();
                    $("#selectQuestion").show();
                    $("#labelOpt").show();
                    //  console.log(data.UserID[0]);
                    //console.log(data.Client);

                    clients = data.Client;
                    localStorage.setItem('userID', data.UserID[0]);


                    if (data.Success === true) {



                        if (data.UserID[0] != null) {

                            $("#btnProceed").show();
                            $("#btnRegister").hide();

                            $("#selectQuestion").append("<option value='#'> Please select the company you worked for </option>");
                            $.each(clients, function(key, val) {
                                console.log(val);
                                $("#selectQuestion").append("<option value='" + val.Value + "'>" + val.Key + "</option>");

                            });


                        } else {
                            $("#selectQuestion").hide();
                            $("#labelOpt").hide();

                            alert('Sorry, member not found!')

                        }



                    } else if (data.UserID[0] === surname) {
                        $("#selectQuestion").hide();
                        alert('You have an existing username, please use the forgot password functionality.');
                    } else if (data.Success === false) {
                        $("#selectQuestion").hide();
                        alert(data.Message);
                    }



                },
                error: function(data) {

                    swal({
                        //title: "Please Type your Mobile Number",
                        text: "Something went wrong !",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                    $("#logged").hide();
                }
            });

        }
        //  }
        $("#btnRegister").val("SIGN UP");
    });



    // PROCEED FORM
    $("#btnProceed").click(function() {
        //$("#btnProceed").show();
        $("#btnRegister").hide();

        //  $("#loginSpace").hide();

        var surname = $("#surname").val();
        var industryNumber = $("#industryNo").val();
        var mobile = $("#mobile").val();



        //  alert(industryNumber);
        $('#loader').show();

        $.ajax({
            url: urls + 'api/getUserCredentials.php',
            type: 'GET',
            data: {
                userID: localStorage.getItem('userID'),
                userAnswer: localStorage.getItem('userAnswer'),
            },
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(res) {
                var data = JSON.parse(JSON.stringify(res));

                var obj = JSON.parse(data.object);



                console.log(obj);

                // alert(data);
                //  var myJSON = JSON.stringify(data);



                var data2 = JSON.parse(data.object);

                console.log(data2.Password);

                //alert(data.DateJoinedFund);
                // var test = new Object();


                if (data.status === 'success') {
                    console.log('GET NEW USER CREDENTIALS');


                    console.log("Data 2");
                    console.log(data2.UserName);
                    console.log(data2.Password);

                    sendSms(mobile, surname, data2.UserName, data2.Password);
                    alert('Your registration was successful, an sms will be sent shortly');
                    window.location.replace("index.html");



                    // console.log(result.Surname);
                    // alert(data.Details.Firstname);
                    //$.each(json.result,function(i,data){

                    //	$("#tab-1").html('<a href="#">Firstname: </a>'   +data.Details.Firstname+'<br> <a href="#">Surname: </a>'   +data.Details.Surname+'<br><a href="#">Date of birth: </a>'   +data.Details.DateOfBirth+'<br><a href="#">ID number: </a>'   +data.Details.IDNumber+'<br><a href="#">Date Joined Fund: </a>'   +data.Details.DateJoinedFund+'<br><a href="#">Date Pensionnable Fee: </a>'   +data.Details.DatePensionableService+'<br> <a href="#">Normal Retirement Date: </a>'+data.Details.NormalRetirementDate+'<br> <a href="#">Date Exit: </a>'   +data.Details.DateOfExit+'<br><a href="#">Member No: </a>'   +data.Details.MemberNo+'<br>').show();
                    //	$("#tab-1").html('<a href="#">Firstname: </a>'   +data.Details.Firstname+'<br> <a href="#">Surname: </a>'   +data.Details.Surname+'<br><a href="#">Date of birth: </a>'   +data.Details.DateOfBirth+'<br><a href="#">ID number: </a>'   +data.Details.IDNumber+'<br><a href="#">Date Joined Fund: </a>'   +data.Details.DateJoinedFund+'<br><a href="#">Date Pensionnable Fee: </a>'   +data.Details.DatePensionableService+'<br> <a href="#">Normal Retirement Date: </a>'   +data.Details.NormalRetirementDate+'<br> <a href="#">Date Exit: </a>'   +data.Details.DateOfExit+'<br><a href="#">Member No: </a>'   +data.Details.MemberNo+'<br>').show();
                    //   $("ul#profile").html('<li><div class="table_section">Firstname: </div><div class="table_section"><b>' + data.Firstname + '</b></div></li><li><div class="table_section">Surname: </div><div class="table_section"><b>' + data.Surname + '</b></div></li><li><div class="table_section">Date of birth: </div><div class="table_section"><b>' + data.DateOfBirth + '</b></div></li><li><div class="table_section">ID number: </div><div class="table_section"><b>' + data.IDNumber + '</b></div></li><li><div class="table_section">Date Joined Fund: </div><div class="table_section"><b>' + data.DateJoinedFund + '</b></div></li><li><div class="table_section">Date Pensionnable Fee: </div><div class="table_section"><b>' + data.DatePensionableService + '</b></div></li><li><div class="table_section">Normal Retirement Date: </div><div class="table_section"><b>' + data.NormalRetirementDate + '</b></div></li><li><div class="table_section">Date Exit: </div><div class="table_section"><b>' + data.DateOfExit + '</b></div></li><li><div class="table_section">Member No: </div><div class="table_section"><b>' + data.MemberNo + '</b></div></li><li></li></b></div><div class="table_section"></div><div class="table_section"><b></b></div><br><br>')
                    //console.log(data.Details.MemberNo);

                    // });
                    //	              $('#loader').hide();

                } else if (data.status === 'failed') {
                    alert('Sorry your anwer was incorrect');
                    window.location.replace("index.html");

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

        //  }
    });

});




function sendSms(mobile, surname, industryNo, password) {


    //  alert('SMS sent');


    console.log(industryNo);
    console.log(password);


    $.ajax({
        url: urls + 'api/sendSms.php',
        type: 'POST',
        data: {
            mobile: mobile,
            surname: surname,
            industryNo: industryNo,
            password: password
        },
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        success: function(res) {
            var data = JSON.parse(res);
            //console.log(res[0]);
            //  var myJSON = JSON.stringify(data);
            console.log(data);
            //alert(data.DateJoinedFund);
            // var test = new Object();

            if (res) {
                console.log('SMS CREDENTIALS SENT');


            } else {

                console.log(data);


            }


        },
        error: function(data) {


        }


    });


}