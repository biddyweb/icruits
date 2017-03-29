/**
 * Created by einjel on 3/20/17.
 */

/*====================================
Menu Active/Deactivate
======================================*/
function openNav() {
    document.getElementById("sidenav").style.width = "250px";
    /*document.getElementById("main").style.marginLeft = "250px";
    /*document.body.style.backgroundColor = "rgba(0,0,0,0.4)";*/
}

function closeNav() {
    document.getElementById("sidenav").style.width = "0";
    /*document.getElementById("main").style.marginLeft= "0";
    /*document.body.style.backgroundColor = "white";*/
}

function openBigNav() {
    var btn = document.getElementById("apply-btn"),
        btn_span = document.getElementById("apply-span"),
        btn_span_2 = document.getElementById("apply-span-2"),
        adv_btn = document.getElementById("back-btn"),
        adv_btn_span = document.getElementById("advanced-span"),
        adv_btn_span_2 = document.getElementById("advanced-span-2");
    document.getElementById("myNav").style.height = "100%";
    classie.addClass( btn, 'show-button');
    classie.addClass( btn_span, 'show-button');
    classie.addClass( btn_span_2, 'show-button');
    classie.addClass( adv_btn, 'show-button');
    classie.addClass( adv_btn_span, 'show-button');
    classie.addClass( adv_btn_span_2, 'show-button');
}

function closeBigNav() {
    var btn = document.getElementById("apply-btn"),
        btn_span = document.getElementById("apply-span"),
        btn_span_2 = document.getElementById("apply-span-2"),
        adv_btn = document.getElementById("back-btn"),
        adv_btn_span = document.getElementById("advanced-span"),
        adv_btn_span_2 = document.getElementById("advanced-span-2");
    document.getElementById("myNav").style.height = "0%";
    classie.removeClass( btn, 'show-button');
    classie.removeClass( btn_span, 'show-button');
    classie.removeClass( btn_span_2, 'show-button');
    classie.removeClass( adv_btn, 'show-button');
    classie.removeClass( adv_btn_span, 'show-button');
    classie.removeClass( adv_btn_span_2, 'show-button');
}

function openUserCont() {
    // body...
    var userIcon = document.getElementById('user-nav'),
        content = document.getElementById('userContent'),
        btn = document.getElementById('btn-1'),
        btn2 = document.getElementById('btn-2');

    if(content.style.width === '280px') {
        content.style.width = '0';
        userIcon.style.color = 'rgb(0, 0, 0)';
        btn.style.display = 'none';
        btn2.style.display = 'none';
    } else {
        content.style.width = '280px';
        userIcon.style.color = 'rgb(255, 255, 255)';
        btn.style.display = 'inline';
        btn2.style.display = 'inline';
    }
}

function forms() {

    if(document.getElementById('RegisterForm')){
        var Form = document.getElementById('RegisterForm');

        new stepsForm(Form, {
            onSubmit: function (form) {
                // hide form
                classie.addClass(Form.querySelector('.simform-inner'), 'hide');
                /*
                 form.submit()
                 or
                 AJAX request (maybe show loading indicator while we don't have an answer..)
                 */

                // let's just simulate something...
                var register = Form.querySelector('.btn');
                classie.addClass(register, 'show');
            }
        });
    }
}

forms();

