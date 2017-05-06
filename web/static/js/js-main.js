/**
 * Created by einjel on 3/20/17.
 */

/*====================================
    User Menu Active/Deactivate
======================================*/
function openNav() {
    $("#sidenav").css({
        width: "250px"
    });
}

function closeNav() {
    $("#sidenav").css({
        width: "0px"
    });
}

/*===============================================
    Create Blueprint Menu Active/Deactivate
===============================================*/
function openBigNav() {
    var btn = document.getElementById("apply-btn"),
        btn_span = document.getElementById("apply-span"),
        btn_span_2 = document.getElementById("apply-span-2"),
        adv_btn = document.getElementById("back-btn"),
        adv_btn_span = document.getElementById("advanced-span"),
        adv_btn_span_2 = document.getElementById("advanced-span-2");
    $("#myNav").css({
        height: "100%"
    });
    classie.addClass( btn, 'show-button');
    classie.addClass( btn_span, 'show-button');
    classie.addClass( btn_span_2, 'show-button');
    classie.addClass( adv_btn, 'show-button');
    classie.addClass( adv_btn_span, 'show-button');
    classie.addClass( adv_btn_span_2, 'show-button');
    $('body').css({
        'overflow-y': 'hidden'
    });
    $('.content-wrap').css({
        'overflow-y': 'hidden'
    });
}

function closeBigNav() {
    var btn = document.getElementById("apply-btn"),
        btn_span = document.getElementById("apply-span"),
        btn_span_2 = document.getElementById("apply-span-2"),
        adv_btn = document.getElementById("back-btn"),
        adv_btn_span = document.getElementById("advanced-span"),
        adv_btn_span_2 = document.getElementById("advanced-span-2");
    $("#myNav").css({
        height: "0"
    });
    classie.removeClass( btn, 'show-button');
    classie.removeClass( btn_span, 'show-button');
    classie.removeClass( btn_span_2, 'show-button');
    classie.removeClass( adv_btn, 'show-button');
    classie.removeClass( adv_btn_span, 'show-button');
    classie.removeClass( adv_btn_span_2, 'show-button');
    $('body').css({
        'overflow-y': 'auto'
    });
    $('.content-wrap').css({
        'overflow-y': 'auto'
    });
}

/*===============================================
        Switch Dashboard Items Per Row
===============================================*/
function switch1Row(dash) {
    $('.dashboardItem').css({
        height: $(window).height() + 'px'
    });
    $('video').css({
        height: $(window).height() + 'px'
    });
    $('.blueprint-overview a').css({
        height: '75px',
        width: '75px',
        'padding-top': '0.7em'
    });
    $('.overlay .blueprint-info').css({
        'margin-top': ($(window).height() / 3) + 'px'
    });
    for (var item=0; dash.length; item++) {
        if(typeof dash[item] === "undefined") {
            return
        } else {
            if (classie.has(dash[item], 'col-sm-3')) {
                classie.remove(dash[item], 'col-sm-3');
            }
            if (classie.has(dash[item], 'col-sm-6')) {
                classie.remove(dash[item], 'col-sm-6');
            }
            if (classie.has(dash[item], 'col-sm-12')) {
                classie.remove(dash[item], 'col-sm-12');
            }
            classie.add(dash[item], 'col-sm-12');
        }
    }
}
function employerSelect1Row() {
    var dash = $("#dashItemEmp > #employerItems");
    switch1Row(dash);
}
function seekerSelect1Row() {
    var dash = $("#dashItemSeeker > #seekerItems");
    switch1Row(dash);
}
function switch2Row(dash) {
    $('.dashboardItem').css({
        height: ($(window).height() / 2) + 'px'
    });
    $('video').css({
        height: ($(window).height() / 2) + 'px'
    });
    $('.overlay .blueprint-info').css({
        'margin-top': ($(window).height() / 7) + 'px'
    });
    $('.blueprint-overview a').css({
        height: '57px',
        width: '57px',
        'padding-top': '0.2em'
    });
    for (var item=0; dash.length; item++) {
        if(typeof dash[item] === "undefined") {
            return
        } else {
            if (classie.has(dash[item], 'col-sm-3')) {
                classie.remove(dash[item], 'col-sm-3');
            }
            else if (classie.has(dash[item], 'col-sm-6')) {
                classie.remove(dash[item], 'col-sm-6');
            }
            else if (classie.has(dash[item], 'col-sm-12')) {
                classie.remove(dash[item], 'col-sm-12');
            }
            classie.add(dash[item], 'col-sm-6');
        }
    }
}
function employerSelect2Row() {
    var dash = $("#dashItemEmp > #employerItems");
    switch2Row(dash);
}
function seekerSelect2Row() {
    var dash = $("#dashItemSeeker > #seekerItems");
    switch2Row(dash);
}
function switch4Row(dash) {
    $('.dashboardItem').css({
        height: '200 px'
    });
    $('video').css({
        height: '200 px'
    });
    $('.overlay .blueprint-info').css({
        'margin-top': '20px'
    });
    $('.blueprint-overview a').css({
        height: '50px',
        width: '50px',
        'padding-top': '0'
    });
    for (var item=0; dash.length; item++) {
        if(typeof dash[item] === "undefined") {
            return
        } else {
            if (classie.has(dash[item], 'col-sm-3')) {
                classie.remove(dash[item], 'col-sm-3');
            }
            else if (classie.has(dash[item], 'col-sm-6')) {
                classie.remove(dash[item], 'col-sm-6');
            }
            else if (classie.has(dash[item], 'col-sm-12')) {
                classie.remove(dash[item], 'col-sm-12');
            }
            classie.add(dash[item], 'col-sm-3');
        }
    }
}
function employerSelect4Row() {
    var dash = $("#dashItemEmp > #employerItems");
    switch4Row(dash);
}
function seekerSelect4Row() {
    var dash = $("#dashItemSeeker > #seekerItems");
    switch4Row(dash);
}

/*=================================================
                Check display size
==================================================*/
function checkSize() {
    var mobPlat = $('#mobilePlatform'),
        pcPlat = $('#pcDisplay');
    if($(window).width() < 767 ){
        mobPlat.css({
            display: 'block'
        });
        pcPlat.css({
            display: 'none'
        });
    } else {
        mobPlat.css({
            display: 'none'
        });
        pcPlat.css({
            display: 'block'
        });
    }
}
$(window).on('load resize', checkSize);

/*=======================================================
            Activate/Deactivate Canvas Menus
=======================================================*/
function openCreateTasks() {
    // body...
    document.getElementById("createTask").style.visibility = "visible";
    document.getElementById("createTask").style.opacity = "1";
}
function closeCreateTasks() {
    document.getElementById("createTask").style.visibility = "hidden";
    document.getElementById("createTask").style.opacity = "0";
}
function openCreateEmployee() {
    // body...
    document.getElementById("createEmployee").style.visibility = "visible";
    document.getElementById("createEmployee").style.opacity = "1";
}
function closeCreateEmployee() {
    document.getElementById("createEmployee").style.visibility = "hidden";
    document.getElementById("createEmployee").style.opacity = "0";
}

/*===================================================
       Position Filter Menu at Top of Screen
===================================================*/
function expandMenuEmp() {
    // body...
    var pos = $(window).scrollTop();
    $('.menu-wrap-emp').css({
        'top': pos + 'px'
    });
}

function expandMenu() {
    // body...
    var pos = $(window).scrollTop();
    $('.menu-wrap').css({
        'height': pos + 'px'
    });
}

$(window).on('ready scroll resize', expandMenuEmp);
//$(window).on('ready scroll resize', expandMenu);
