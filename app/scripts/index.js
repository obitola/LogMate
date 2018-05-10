$(document).ready(function() {
    //object for easy manipulation of elements
    window.subList = {};
    window.shopList = {};
    window.shopItem = {};

    window.ids = {};
    window.error_bar = $("#err-msg-bar");
    window.type_list = $("#type-list");

    makeColumns(getGroceries);

    // Different ways to use jQueyr (tied to the $ symbol) to make listeners for clicking on an element
    /* 
        This is grabbing onto any div child of id=wrapper's that has a class 'filled'
        because the actual classes that we want to make clickable are rendered through JavaScript
        and won't be there when we try to tie this listener to them quite yet
    */
    $("#wrapper").on("click", "div.filled", function() { prepInfo(this); });

    $(".gtype").click(function() { setType($(this).text()); });

    $("#g-add").click(function() { addGrocery(); });

    $("#g-update").click(function() { updateGrocery(); });

    $("#g-delete").click(function() { delGrocery(); });

    $("#g-type").click(function() { getGroceryType(); });
});

// Ajax Calls ------------------------------------------------------------------------------------------------------

var getGroceries = function() {
    $(".shop-li").text("");
    $(".filled").removeClass("filled");
    $.ajax({
        "method": "GET",
        "crossDomain": true,
        "url": "http://localhost:8080/api/groceries/all/",
        "success": getAllRes,
        "error": function(err) {
            error_bar.text(err);
        }
    });
    shopItem = {};
}

var getGroceryType = function() {
    // variable to send to the URL
    type = $("#grocery-type").text();

    if (type.startsWith("Choose a type:"))
        type = "*";
    $.ajax({
        "method": "", //Fill in your method type here (GET, POST, PUT, DELETE)
        "crossDomain": true,
        "url": "http://localhost:8080/api/groceries/all/", //Choose your URL path
        "success": getType,
        "error": function(err) {
            error_bar.text(err);
        }
    });
    shopItem = {};
}

var addGrocery = function() {
    var name = $("#name").val();
    var price = $("#price").val();
    var type = $("#grocery-type").text().slice(0, -1);

    console.log("name: " + name + " price: " + price + " type: " + type + "? " + type.startsWith("Choose a type: "));

    if (name === '' || price === '' || type.startsWith("Choose a type:")) {
        error_bar.text("Name, price, and type must be specified");
    } else {
        error_bar.text("");
        console.log($("#item9").text() === "");
        if ($("#item9").text() === "") {
            $.ajax({
                "method": "PUT", //Fill in your method type here (GET, POST, PUT, DELETE)
                "crossDomain": true,
                "url": "http://localhost:8080/api/groceries/all/", //Choose your URL path
                "data": {

                },
                "success": postNew,
                "error": function(err) {
                    error_bar.text(err);
                }
            });
        } else {
            error_bar.text("We're limiting the element count to 10 for this example");
        }
    }
    shopItem = {};
}

var updateGrocery = function() {
    if (!shopItem.id) {
        console.log("Please click on an item to update");
        return;
    }
    var id = shopItem.id;
    var name = $("#name").val();
    var price = $("#price").val();
    var type = $("#grocery-type").text().slice(0, -1);

    if (name == shopItem.name && price == shopItem.price && type == shopItem.type) {
        error_bar.text("Please alter the item in some way");
        return;
    } else if (type.startsWith("Choose a type:")) {
        error_bar.text("Type must be specified");
        return;
    } else {
        error_bar.text("");
        console.log($("#item9").text() === "");
        $.ajax({
            "method": "PUT", //Fill in your method type here (GET, POST, PUT, DELETE)
            "crossDomain": true,
            "url": "http://localhost:8080/api/groceries/all/", //Choose your URL path
            "data": {},
            "success": updateOld,
            "error": function(err) {
                error_bar.text(err);
            }
        });
    }
}

var delGrocery = function() {
    if (!shopItem.id) {
        console.log("Please click on an item to delete");
    } else {
        var id = shopItem.id;
        error_bar.text("");
        console.log($("#item9").text() === "");
        $.ajax({
            "method": "DELETE", //Fill in your method type here (GET, POST, PUT, DELETE)
            "crossDomain": true,
            "url": "http://localhost:8080/api/groceries/all/", //Choose your URL path
            "data": {},
            "success": deleteOld,
            "error": function(err) {
                error_bar.text(err);
            }
        });
    }
}

// Ajax Success function definitions -------------------------------------------------------------------------------

var getAllRes = function(groceries) {
    if (typeof groceries === "string") { //Here, we're sending a string as our error message
        error_bar.text(groceries);
    } else {
        shopList = groceries;
        type_list.text(JSON.stringify(shopList, undefined, 2));
        $.each(groceries, function(i, el) {
            item = $("#item" + i);
            item.text(el.name);
            item.addClass("filled");
            ids["item" + i] = el.id;
        });
        error_bar.text("");
    }
}

var getType = function(groceries) {
    if (typeof groceries === "string") { //Here, we're sending a string as our error message
        error_bar.text(groceries);
    } else {
        subList = groceries;
        type_list.text(JSON.stringify(subList, undefined, 2));
        error_bar.text("");
    }
}

var postNew = function(message) {
    if (message == "Invalid POST") {
        error_bar.text("Your post was insuccessful, are all the necessary fields filled out?");
    } else {
        getGroceries();
    }
}

var updateOld = function(message) {
    if (message == "Invalid PUT") {
        error_bar.text("Your put was insuccessful, are all the fields filled out?");
    } else {
        shopItem = {};
        getGroceries();
    }
}

var deleteOld = function(message) {
    if (message == "Invalid DELETE") {
        error_bar.text("Your delete was insuccessful, did you select an input?");
    } else {
        shopItem = {};
        getGroceries();
    }
}

// Extra Webpage Operational Functions -----------------------------------------------------------------------------

var setType = function(txt) {
    $("#grocery-type").text(txt + " ").append("<span class=\"caret\"></span>");

    if (txt == "Choose a type:")
        shopItem.type = "";
    else
        shopItem.type = txt;
}

var makeColumns = function(callback) {
    list = $("#list"); //This grabs the element in the DOM (look in the html file) w/ id='list'
    list.empty();
    for (var i = 0; i < 10; i++) {
        list.append("<div class=\"shop-el\"><div class=\"shop-li\" id=\"item" + i + "\"></div></div>");
    }

    if (callback) {
        callback();
    }
}

var prepInfo = function(that) {
    id = ids[$(that).attr('id')];
    shopItem = shopList.find(function(el) {
        return el.id === id;
    });

    $("#name").val(shopItem.name);
    $("#price").val(shopItem.price);
    setType(shopItem.type);
}