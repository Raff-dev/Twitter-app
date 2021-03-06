function saveToken() {
    $('.login-button').on('click', function () {
        var form = document.getElementById('login-form')
        var formData = new FormData(form)
        let url = '/token/'
        let response = apiRequest(url, 'POST', formData, true)
        console.log('response', response['token'])
        if (response) {
            let token = response['token']
            localStorage.setItem('token', token)
        }
    })
}
function clearSessionStorage() {
    $('#logout').on('click', function () {
        localStorage.clear()
    })
}
function toggleDropdown(post_id) {
    function outsideClickListener(event) {
        let condition1 = !$(event.target).parents('.options').length
        var condition2 = $(event.target).parents('#dropdown-' + post_id).length
        if (condition1 || condition2) {
            dropdown.style.display = 'none';
            document.removeEventListener('click', outsideClickListener);
        }
    }
    var dropdown = document.getElementById('dropdown-' + post_id);
    var button = document.getElementById('options-' + post_id);
    button.onclick = event => {
        dropdown.style.display = 'block';
        document.addEventListener('click', outsideClickListener);
    }
}
function togglePublishButton(button_id, input_id) {
    var button = document.getElementById(button_id)
    var input = document.getElementById(input_id)
    button.disabled = true;
    input.onblur = fun
    input.onfocus = fun
    input.onkeyup = fun
    function fun() {
        if (input.value === "")
            button.disabled = true;
        else button.disabled = false;
    }
}
function addImage(input_id, iscomment = false) {
    $(input_id).on("change", function () {
        if (this.files && this.files[0]) {
            $(this.files).each((index, file) => {
                if (iscomment) create_files = comment_create_files
                else create_files = post_create_files
                create_files.push(file)
                var reader = new FileReader();
                reader.onload = event => {
                    var div = $(document.createElement('div'))
                    var close = $(document.createElement('div'))
                    var picture = "<img src='" + event.target.result + "' class='input-image'>"
                    div.addClass('create-image')
                    close.addClass('delete-image')
                    close.append("<div class='x1'></div><div class='x2'></div>")
                    div.append(picture, close)
                    if (iscomment) $("#modal-create-images").append(div);
                    else $("#create-images").append(div);
                    close.click(function () {
                        $(create_files).each((i, f) => {
                            if (f == file) create_files.splice(i, 1)
                        })
                        close.parent().remove()
                    })
                }
                reader.readAsDataURL(this.files[index]);
            })
        }

    });
}
function imagePreviewListener(img) {
    $(img).on("click", function () {
        $('.img-preview').find('.img').append(img.cloneNode())
        $('.img-preview').css('display', 'block')
        $('#close-img-modal').on('click', function () {
            $('.img-preview .img').empty()
            $('.img-preview').css('display', 'none')
        })
    })
}
function postDetailRedirect(post_id) {
    $(document.getElementById("post-" + post_id)).click(function (e) {
        let c1 = $(e.target).parents('.like-div').length
        let c2 = $(e.target).parents('.share').length
        let c3 = $(e.target).parents('.comment').length
        let c4 = $(e.target).parents('.options').length
        let c5 = $(e.target).parents('.post-images').length
        let c6 = $(e.target).parents('.img').length
        let c7 = $(e.target).parents('.profile-follow').length
        if (!c1 && !c2 && !c3 && !c4 && !c5 && !c6 && !c7) {
            let post = $(this).parent('.post').prevObject.get(0)
            let url = $(post).attr("href")
            if (url != location.pathname)
                window.location.replace(url);
        }
    })
}
function scrollLoad(id_list, count, destination_id) {
    window.addEventListener('scroll', scrollListener.bind(null, id_list, count, destination_id));
}
function scrollListener(id_list, count, destination_id, event) {
    let footer = document.getElementById('footer')
    let body = document.getElementById('body')
    let diff = body.offsetHeight - (window.scrollY + window.innerHeight);
    if (diff < footer.offsetHeight) loadPosts(id_list, count, destination_id);
    window.requestAnimationFrame(function () {
    });
}
function markLiked(post_id) {
    let el = $(document.getElementById("like-" + post_id))
    let url = $(el).attr('url')
    let method = 'GET'
    let isliked = apiRequest(url, method)
    toggleLikeIcon(el, isliked)
}
function toggleLikeIcon(el, isliked) {
    if (isliked) {
        el.children('.liked').css('opacity', '1')
        el.siblings('p').css('color', 'red')
    } else {
        el.children('.liked').css('opacity', '0')
        el.siblings('p').css('color', 'black')
    }
}
function markFollowed(post_id) {
    let el = $(document.getElementById("follow-" + post_id))
    let url = $(el).attr('url')
    let method = 'GET'
    let isliked = apiRequest(url, method)
    toggleFollow(el, isliked)
}
function toggleFollow(el, isfollowed) {
    if (isfollowed) {
        el.addClass('unfollow')
        el.find('p').text('Unfollow')
    }
    else {
        el.find('p').text('Follow')
        el.removeClass('unfollow')
    }
}
function markHrefAndTags(content) {
    var content;
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    var hashtagRegex = /(^|[\s])[#][a-zA-z_0-9-]*[a-zA-z]+[a-zA-z_0-9-]*/g;
    var nametagRegex = /(^[@]|[\s][@])[a-zA-z_0-9-]+/g;
    var cleanHashtagRegex = /^[\s]*/g;
    var cleanNametagRegex = /^[\s]*/g;
    var NohashRegex = /[\s]*[#]/g;
    var NoAtRegex = /[\s]*[@]/g;
    content.innerHTML = content.innerHTML.replace(urlRegex, function (url) {
        return '<a href="' + url + '">' + url + '</a>';
    })
    content.innerHTML = content.innerHTML.replace(hashtagRegex, function (hashtag) {
        cleanHashtag = hashtag.replace(cleanHashtagRegex, '')
        cleanTag = cleanHashtag.replace(NohashRegex, '')
        return ' <a href="' + '/hashtag/' + cleanTag + '">' + cleanHashtag + '</a>';
    })
    content.innerHTML = content.innerHTML.replace(nametagRegex, function (nametag) {
        cleanNametag = nametag.replace(cleanNametagRegex, '')
        cleanTag = cleanNametag.replace(NoAtRegex, '')
        let url = '/api/users/' + cleanTag + '/get/'
        if (apiRequest(url, 'GET'))
            return ' <a href="' + '/profile/' + cleanTag + '">' + cleanNametag + '</a>';
        else
            return content.innerHTML
    })
}
function findHashtags(content) {
    var hashtagRegex = /(^|[\s])[#][a-zA-z_0-9-]*[a-zA-z]+[a-zA-z_0-9-]*/g;
    var NohashRegex = /[\s]*[#]/g;
    hashtags = content.match(hashtagRegex)

    $(hashtags).each((index, hashtag) => {
        hashtags[index] = hashtag.replace(NohashRegex, '')
    })
    return hashtags
}
function setLikeText(obj, newVal) {
    if (newVal == 1) $(obj).text(newVal + " Like");
    else $(obj).text(newVal + " Likes");
}
function closeEdit(post_id) {
    var button = document.querySelector("#edit-button-" + post_id);
    document.querySelector("#edit-group-" + post_id).style.display = 'none';
    let content = document.querySelector("#content-div-" + post_id)
    if ($(content).attr('comment') == 'yes')
        content.style.display = 'inline-block';
    else content.style.display = 'flex';
    $(button).text('Edit');
    setClicked(button, 'primary');
}
function editOnClick(post_id) {
    $("#edit-button-" + post_id).on("click", function (event) {
        if (this.innerText == 'Edit') {
            document.querySelector("#edit-group-" + post_id).style.display = 'flex';
            document.querySelector("#content-div-" + post_id).style.display = 'none';
            $(this).text('Close');
            setClicked(this, 'primary');
        } else closeEdit(post_id);
    });
}
function loadPosts(id_list, count, destination_id) {
    var destination = document.getElementById(destination_id)
    var posts_loaded = destination.childElementCount
    var lim = Math.min(posts_loaded + count, Object.keys(id_list).length)
    for (; posts_loaded < lim; posts_loaded++) {
        appendPost((destination), append, id_list[posts_loaded]);
    }
}
function appendPost(node, mode, post_id) {
    let url = '/post/post_template/' + post_id
    let post = document.createElement('div')
    let response = apiRequest(url, 'GET')
    if (response != false) {
        post.innerHTML = response
        $(post).css('display', 'none')
        if (mode == append) node.append(post);
        else node.prepend(post);
        $(post).slideDown("fast")
        addListeners(post_id);
        markLiked(post_id);
        markFollowed(post_id);
        let content = document.getElementById("content-" + post_id)
        markHrefAndTags(content);
        $(post).find('.image').each((index, elem) => {
            imagePreviewListener(elem)
        })
    }
}
//-----------------------
function postCreated(result, iscomment) {
    if (iscomment) {
        let parent_id = result['parent']
        comment_create_files = []
        url = $('#post-' + parent_id).attr('href')
        if (url != location.pathname)
            window.location = url
        else {
            let post_id = result['id']
            appendPost(document.getElementById('posts'), prepend, post_id);
            $('.create-images').empty()
            $('#modal-create')[0].disabled = true
            closeCommentModal()
            $('#comments-label').text($('#posts').children().length)
            comment_create_files = []
        }
    }
    else {
        let post_id = result['id']
        document.getElementById('create-input').value = ''
        appendPost(document.getElementById('posts'), prepend, post_id);
        $('.create-images').empty()
        $('#create')[0].disabled = true
        post_create_files = []
    }
}
function postLiked(post_id, isliked) {
    var el = $(document.getElementById("like-" + post_id))
    var likes_count = parseInt(el.attr('likes-count'));
    if (isliked) likes_count++
    else likes_count--
    el.attr("likes-count", likes_count);
    $('#like-label-' + post_id).text(likes_count)
    toggleLikeIcon(el, isliked)
}
function postDeleted(post_id) {
    var post = document.getElementById("post-" + post_id);
    if (!post) post = document.getElementById("comment-" + post_id)
    post.parentNode.removeChild(post);
}
function postUpdated(post_id) {
    let authorHref = document.getElementById('at-author-' + post_id)
    var text = document.getElementById("input-" + post_id).value;
    let content = $(document.getElementById("content-" + post_id))
    $(document.getElementById("content-" + post_id)).text(' ' + text);
    if (content.attr('comment') == 'yes');
    // document.getElementById("content-" + post_id).prepend(authorHref);
    closeEdit(post_id);
    markHrefAndTags(content);
}
//-----------------------
function apiRequest(url, method, data = null, flag = false) {
    var result = NaN;
    let contentType = false
    let processData = false
    let headers = { 'Authorization': 'Token ' + localStorage.getItem('token') }
    if (flag) headers = {}
    if (data == null) {
        data = {
            "csrfmiddlewaretoken": csrf_token,
        }
        contentType = 'application/x-www-form-urlencoded; charset=UTF-8'
        processData = true
    }
    let args = {
        url: url,
        method: method,
        async: false,
        data: data,
        cache: false,
        headers: headers,
        processData: processData,
        contentType: contentType,
        success: function (response) {
            result = response;
        },
        error: function (errorData) {
            console.log('query error');
            console.log('errorData:', errorData);
            result = false
        }
    }
    $.ajax(args)
    return result;
}
function addListeners(post_id) {
    likePostListener(post_id);
    followPostListener(post_id);
    deletePostListener(post_id);
    commentPostListener(post_id)
    postDetailRedirect(post_id);
    //editPostlListener(post_id);
    editOnClick(post_id);
    toggleDropdown(post_id);
}
function likePostListener(post_id) {
    $('#like-' + post_id).on('click', function () {
        let url = $(this).attr('url')
        let method = 'POST'
        let result = apiRequest(url, method, null)
        postLiked(post_id, result['liked'])
    })
}
function followPostListener(post_id) {
    let follow_btn = $('#follow-' + post_id)
    follow_btn.on('click', function () {
        let url = $(this).attr('url')
        let method = 'POST'
        let result = apiRequest(url, method)
        toggleFollow(follow_btn, result['followed'])
    })
}
function createPostListener(button, form_id, iscomment = false) {
    button.on('click', function () {
        var form = document.getElementById(form_id)
        let url = $(this).attr('url')
        let method = 'post'
        console.log(form, url, method)
        var files
        if (iscomment) files = comment_create_files
        else files = post_create_files
        var formData = new FormData(form)
        console.log('url', url)
        $(files).each((index) => {
            formData.append('img' + index, files[index])
        })
        let content = formData.get('content')
        let hashtags = findHashtags(content)
        formData.append('hashtags', hashtags)
        formData.append('csrfmiddlewaretoken', csrf_token)
        console.log('data', formData.get('hashtags'))
        let result = apiRequest(url, method, formData)
        console.log('result', result)
        postCreated(result, iscomment)
    })
}
function deletePostListener(post_id) {
    let btn_delete = document.getElementById("delete-" + post_id)
    if (btn_delete) {
        let btn_confirm = document.getElementById('alert-confirm')
        let btn_cancel = document.getElementById('alert-cancel')
        btn_delete.onclick = () => {
            $('#alert').css('display', 'flex')
            $('#alert-confirm').text('Delete Post?')
            $('#alert-title').text('Delete')
            btn_confirm.onclick = () => {
                let url = $(btn_delete).attr('url')
                let method = 'post'

                if (apiRequest(url, method)) {
                    postDeleted(post_id)
                    $('#alert').css('display', 'none')
                } else console.log('deletion failed')
                $(btn_delete).unbind()
                $(btn_cancel).unbind()

            }
            btn_cancel.onclick = () => {
                $('#alert').css('display', 'none')
                $(btn_delete).unbind()
                $(btn_cancel).unbind()
            }
        }
    }
}
function editPostlListener(post_id) {
    $('#edit-' + post_id).on('click', function () {
        let url = 'post/api/post/' + post_id + '/'
        let method = 'patch'
        let content = document.getElementById('create-input').value
        let data = { 'content': content }
        if (apiRequest(url, method, data)) postUpdated(post_id)
    })
}
function commentPostListener(post_id) {
    let destination = document.getElementById('comment-modal')
    $("#comment-" + post_id).on("click", function () {
        let url = $(this).attr('url')
        let method = 'GET'
        let modal = apiRequest(url, method)

        var $body = $(document.body);
        var oldWidth = $body.innerWidth();
        $body.css("overflow", "hidden");
        $body.width(oldWidth);

        $(destination).empty()
        destination.innerHTML = modal
        closeCommentModalListener()
        createPostListener($("#modal-create"), "modal-create-form", true)
        togglePublishButton('modal-create', "modal-create-input")
        addImage('#modal-img-input', true)
    })
}
function closeCommentModalListener() {
    let btn_confirm = document.getElementById('alert-confirm')
    let btn_cancel = document.getElementById('alert-cancel')

    $("#close-comment-modal").on('click', function () {
        var inputval = document.getElementById('modal-create-input').value
        if (inputval.length) {
            $('#alert').css('display', 'flex')
            $('#alert-confirm').text('Discard Post?')
            $('#alert-title').text('Discard')

            btn_confirm.onclick = () => {
                closeCommentModal()
                $('#alert').css('display', 'none')
                $(btn_confirm).unbind()
                $(btn_cancel).unbind()
            }
            btn_cancel.onclick = () => {
                $('#alert').css('display', 'none')
                $(btn_confirm).unbind()
                $(btn_cancel).unbind()
            }
        } else {
            comment_create_files = []
            closeCommentModal()
        }
    })
}
function closeCommentModal() {
    comment_create_files = []
    $('#comment-modal').empty()
    var $body = $(document.body);
    $body.css('overflow', 'auto')
    $body.width("auto");
}
function loadProfileImg(ids) {
    $.each(ids, (input, img_id) => {
        console.log('id val', input, img_id)
        console.log('', input, img_id)
        $('#' + input).on('change', function () {
            console.log('files', this.files)
            if (this.files && this.files[0]) {
                profile_imgs[img_id] = this.files[0]
                console.log('imgs', profile_imgs)
                var reader = new FileReader();
                reader.onload = event => {
                    console.log('huj', $("#" + img_id).attr('src'))
                    $("#" + img_id).attr('src', event.target.result)
                }
                reader.readAsDataURL(this.files[0]);
            }
        })
    })
}
function updateProfileListener() {
    let alias = $('#alias-text').text()
    let description = $('#description-text').text()
    $('#alias').attr('value', alias)
    $('#description').attr('value', description)
    $("#profile-save-buton").on("click", function () {
        event.preventDefault();
        var form = document.getElementById("update-form")
        console.log('thisform', form)
        var formData = new FormData(form);
        var url = $(form).attr("url");
        var method = 'PATCH'
        $.each(profile_imgs, (key, value) => {
            console.log(key, value)
            if (value) formData.append(key, value)
        })
        formData.append('csrfmiddlewaretoken', csrf_token)
        console.log('serialized', $(form).serializeArray())
        let result = apiRequest(url, method, formData)
        if (result) location.reload()
    })
}
function toggleUpdateModal() {
    let modal = $(".update-modal")
    $(".profile-update").on("click", function () {
        modal.css('display', 'flex')
    })
    $("#update-close").on('click', function () {
        modal.css('display', 'none');
    })
}
function switchProfileContent() {
    let buttons = document.getElementsByClassName("switch-content")
    for (const button of buttons) $(button).on('click', function (click, kek) {
        let button = $(click.target).closest('.switch-content')
        let div_id = button.attr('div')
        let div = $("#" + div_id)
        if (div.children().length) return
        $('.posts').children().each((index, el) => {
            $(el).empty()
        })
        $('.switch-content').removeClass('clicked')
        button.toggleClass('clicked')
        let url = div.attr('url')
        console.log(url)
        let ids = apiRequest(url, 'get')
        loadPosts(ids, 5, div_id)
        window.removeEventListener("scroll", scrollListener)
        scrollLoad(ids, 3, div_id)
    })
}
const prepend = 0;
const append = 1;