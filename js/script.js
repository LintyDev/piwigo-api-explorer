$(document).ready(function () {
    localStorage.setItem('tags', JSON.stringify([]));
    localStorage.setItem('tag', 20);
    var selectedSort = $(".select-filter").val();
    var defaultSearch = "europe";
    var currentPage = 0;
    let hasTyped = false;

    getData(defaultSearch, currentPage, selectedSort);
    getTags();

    $("#search-bar").on("keyup", function() {
        const inputValue = $(this).val() === "" ? defaultSearch : $(this).val();
        getData(inputValue, currentPage, selectedSort);
        getTags();
        localStorage.setItem('tags', JSON.stringify([]));
    });

    $(".select-filter").change(function() {
        console.log(selectedSort);
        var selectedValue = $(this).val();
        var pagination = $('#pagination-type').data('value');
        if(pagination === 'query') {
            var query = $('#search-bar').val() === '' ? 'europe' : $('#search-bar').val();
            getData(query, 0, selectedValue);
        } else if (pagination === 'tags') {
            var tab = JSON.parse(localStorage.getItem('tags'));
            searchByTag(tab, 0, selectedValue);
        }
    });

    var inputWidth = $("#search-bar").outerWidth();
    var inputMarginLeft = parseInt($("#search-bar").css("margin-left"));
    $("#tag-lists").css("max-width", inputWidth + inputMarginLeft + "px");
});

$(document).on('click', '.pag', function() {
    var pagination = $('#pagination-type').data('value');
    var page = $(this).data('value');
    var selectedSort = $(".select-filter").val();
    if(pagination === 'query') {
        var query = $('#search-bar').val() === '' ? 'europe' : $('#search-bar').val();
        getData(query, page - 1, selectedSort);
    } else if (pagination === 'tags') {
        var tab = JSON.parse(localStorage.getItem('tags'));
        searchByTag(tab, page - 1, selectedSort);
    }
});
$(document).on('click', '.tag', function() {
    $('#search-bar').val('');
    var selectedSort = $(".select-filter").val();
    var tab = JSON.parse(localStorage.getItem('tags'));
    var tagId = $(this).data('value');
    var tabTagId = [];
    var selectedTag = $('p.tag[data-value="'+tagId+'"]');
    var textTag = selectedTag.text();

    if(textTag.startsWith(" + ")) {
        selectedTag.text(textTag.replace(" + ", " - "));
        tabTagId = queryTag(tab, tagId, 'push');
        selectedTag.appendTo('#tag-lists-selected');

    } else if (textTag.startsWith(" - ")) {
        selectedTag.text(textTag.replace(" - ", " + "));
        tabTagId = queryTag(tab, tagId, 'remove');
        selectedTag.prependTo('#tag-lists');
    }

    localStorage.setItem('tags', JSON.stringify(tab));
    if(tabTagId.length === 0) {
        getData('europe', 0, selectedSort);
    } else {
        searchByTag(tabTagId, 0, selectedSort);
    }
});
$(document).on('click', '#mores-tags', function() {
    var tag = localStorage.getItem('tag');
    localStorage.setItem('tag', Number(tag) + 5);
    getTags();
});
