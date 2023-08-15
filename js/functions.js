function getUrlApi(){
    let fullUrl = window.location.href;
    let position = fullUrl.lastIndexOf('/explore'); // Mettre le nom du dossier où est situé l'index.html
    let baseUrl = fullUrl.substring(0, position);
    return baseUrl;
}
function displayPicture(data) {
    var itemsAppends = '';
    
    $.each(data, function (i, item) {
        itemsAppends += `<li><img src="${item.derivatives.small.url}"></li>`;
    });
    $(".items").append(itemsAppends).fadeIn(1000);

}
function displayPagination(pages, page, typePag) {
    let itemsAppends = '<div class="">';
    let active;
    let pageLow = page - 1;
    let pageHigh = page + 1;

    if (page > 1) {
        itemsAppends += '<p id="backPicture">&laquo;</p>';
    }
    // Affiche toutes les pages si inférieur à 20
    if (pages < 20) {
        for (let p = 1; p <= pages; p++) {
            active = page == p ? "active" : "";
            itemsAppends += '<p data-value="' + p + '" class="pag ' + active + '">' + p + '</p>';
        }
    } else {
        if (page > 2) {
            itemsAppends += '<p data-value="1" class="pag">1</p>';
            if (page > 3) {
                itemsAppends += '<p id="dotLeft" data-value="' + (page - 2) + '" class="pag">...</p>';
            }
        }
        if (page === 1) {
            pageHigh += 2;
        } else if (page === 2) {
            pageHigh += 1;
        }
        if (page === pages) {
            pageLow -= 2;
        } else if (page === pages - 1) {
            pageLow -= 1;
        }
        for (let p = pageLow; p <= pageHigh; p++) {
            if (p === 0) {
                p += 1;
            }
            if (p > pages) {
                continue
            }
            active = page == p ? "active" : "";
            itemsAppends += '<p data-value="' + p + '" class="pag ' + active + '">' + p + '</p>';
        }
        if (page < pages - 1) {
            if (page < pages - 2) {
                itemsAppends += '<p id="dotRight" data-value="' + (page + 2) + '"class="pag">...</p>';
            }
            itemsAppends += '<p data-value="' + pages + '" class="pag">' + pages + '</p>';
        }
    }
    if (page < pages) {
        itemsAppends += '<p id="nextPicture">&raquo;</p>';
    }
    itemsAppends += '</div>';
    $('#pagination-type').attr('data-value', `${typePag}`);
    $('.pagination').html(itemsAppends);
    return itemsAppends;
}
function getData(query, currentPage, order) {
    var url = getUrlApi();
    var apiUrl = url+"/ws.php?format=json";
    $.ajax({
        url: apiUrl,
        type: "GET",
        data: {
            method: 'pwg.images.search',
            query: query,
            per_page: '16',
            page: currentPage,
            order: order
        },
        success: function (response) {
            $("#container-search-content").hide();
            $(".items").hide().empty();
            $('.pagination').html('');
            var data = JSON.parse(response);
            if (data.result && data.result.images.length > 0) {
                var pagination = Math.ceil(data.result.paging.total_count / data.result.paging.per_page);
                displayPagination(pagination, (currentPage + 1), 'query');
                displayPicture(data.result.images);
            } else {
                $("#container-search-content").show();
                console.log("No picture found !");
            }
        },
        error: function (error) {
            console.log(error);
        },
    });
}
function randomColorTags(tab) {
    var i = Math.floor(Math.random() * tab.length);
    return tab[i];
}
function getTags() {
    var tag = localStorage.getItem('tag');
    var url = getUrlApi();
    var apiUrl = url+"/ws.php?format=json";
    var color = ['blue', 'purple', 'pink', 'green', 'yellow', 'skyblue', 'red', 'lightgreen'];
    var tagsAppend = '';
    $('#tag-lists').html('');
    $('#tag-lists-selected').html('');
    $.ajax({
        url: apiUrl,
        type: "GET",
        data: {
            method: 'pwg.tags.getList',
            sort_by_counter: 'true'
        },
        success: function (data) {
            var response = JSON.parse(data);
            var tagNumber = response.result.tags.length;
            if(tag > tagNumber) {
                tag = tagNumber;
            }
            if (response.result) {
                for (t = 1; t <= tag; t++) {
                    var tagColor = randomColorTags(color);
                    var tagName = response.result.tags[t - 1].name;
                    var tagId = response.result.tags[t - 1].id;
                    tagsAppend += '<p data-value="' + tagId + '" class="tag ' + tagColor + '"> + ' + tagName + '</p>';
                }
                tagsAppend += '<p id="mores-tags" class="tag"> mores tags</p>'
            }
            $('#tag-lists').html(tagsAppend).fadeIn(1000);
        },
        error: function (error) {
            console.log(error)
        }
    });
}
function searchByTag(tagId, currentPage, order) {
    var url = getUrlApi();
    var apiUrl = url+"/ws.php?format=json";

    $.ajax({
        url: apiUrl,
        type: "GET",
        data: {
            method: 'pwg.tags.getImages',
            tag_id: tagId,
            per_page: '16',
            page: currentPage,
            order: order,
        },
        success: function (response) {
            var data = JSON.parse(response);
            $("#container-search-content").hide();
            $(".items").hide().empty();
            $('.pagination').html('');
            if (data.result && data.result.images.length > 0) {
                var pagination = Math.ceil(data.result.paging.total_count / data.result.paging.per_page);
                displayPagination(pagination, (currentPage + 1), 'tags');
                displayPicture(data.result.images);
            } else {
                $("#container-search-content").show();
                console.log("No picture found !");
            }
        },
        error: function (error) {
            console.log(error);
        },
    });
}
function queryTag(tab, tagId, action) {
    var i = tab.indexOf(tagId);
    if (action === 'remove') {
        if (i !== -1) {
            tab.splice(i, 1);
        }
    } else if (action === 'push') {
        tab.push(tagId);
    } else {
        tab = [];
    }
    return tab;
}