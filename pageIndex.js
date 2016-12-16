; (function () {
    var pageIndexDom = '<div class="row" id="pageindexContainer">'
                                + '<input type="hidden" id="dataCount">'
                                + '<input type="hidden" id="currentPage" value="1">'
                                + '<div class="col-sm-12">'
                                    + '<div class="dataTables_paginate paging_simple_numbers" id="dataTables-example_paginate">'
                                        + '<ul class="pagination" id="pages">'
                                        + '</ul>'
                                    + '</div>'
                                + '</div>'
                           + ' </div>';

    $.fn.pageIndex = function (options, indexChangeCallback) {
        $("#pageindexContainer").remove();
        $(this).after(pageIndexDom);

        var defaults = {
            'dataCount': 1,
            'page': 1,
            'pageSize': 10
        };
        var settings = $.extend({}, defaults, options);
        $("#dataCount").val(settings.dataCount);
        $("#currentPage").val(settings.page);
        //$("#currentPageMin").val(settings.page * settings.pageSize + 1);
        ////当前页的最大值
        //var max = (settings.page + 1) * settings.pageSize;
        //if (settings.dataCount < max) {
        //    max = settings.dataCount;
        //}
        //$("#currentPageMax").val(max);

        //页数
        var pageCount = Math.ceil(settings.dataCount / settings.pageSize);

        //参数回调的形式，每次翻页会重新初始化翻页指示器
        if (settings.page > 1) {
            $("#pages").append('<li class="paginate_button previous" id="previous"><a href="javascript:;">上一页</a></li>');
        } else {
            $("#pages").append('<li class="paginate_button previous disabled" id="previous"><a href="javascript:;">上一页</a></li>');
        }
        for (var i = 1; i < pageCount + 1; i++) {
            if (settings.page === i) {
                $("#pages").append('<li class="paginate_button pagenumber active"><a href="javascript:;">' + i + '</a></li>');
            } else {
                $("#pages").append('<li class="paginate_button pagenumber"><a href="javascript:;">' + i + '</a></li>');
            }
        }
        if (pageCount === 1 || settings.page === pageCount) {
            $("#pages").append('<li class="paginate_button next disabled" id="next"><a href="javascript:;">下一页</a></li>');
        } else {
            $("#pages").append('<li class="paginate_button next" id="next"><a href="javascript:;">下一页</a></li>');
        }

        //上一页
        $("#previous").bind("click", function () {
            var currentpage = parseInt($("#currentPage").val());
            if (currentpage === 1) {
                $("#previous").addClass("disabled");
                return false;
            }
            if (typeof (indexChangeCallback) == "function") {
                indexChangeCallback(currentpage - 1);
            } else {
                pageIndexChang(currentpage - 1);
            }
            $("#currentPage").val(currentpage - 1);
            $(".paginate_button").each(function (index, ele) {
                if (parseInt($(ele).children("a").text()) === currentpage - 1) {
                    $(ele).addClass("active");
                    $(ele).next().removeClass("active");
                }
            });
            currentpage = parseInt($("#currentPage").val());
            if (currentpage + 1 > pageCount) {
                $("#next").addClass("disabled");
            } else {
                $("#next").removeClass("disabled");
            }
            if (currentpage === 1) {
                $(this).addClass("disabled");
            }
        });

        //下一页
        $("#next").bind("click", function () {
            //获取当前页
            var currentpage = parseInt($("#currentPage").val());
            /*页码按钮样式处理*/
            //当前页已经是最大页，把"下一页"按钮置灰同时不做任何处理
            if (currentpage + 1 > pageCount) {
                $(this).addClass("disabled");
                return false;
            }
                //当前页是倒数第二页，把"下一页"按钮置灰
            else if (currentpage + 1 === pageCount) {
                $(this).addClass("disabled");
            }
                //其他情况，把"下一页"按钮取消置灰状态
            else {
                $(this).removeClass("disabled");
            }
            /*翻页事件调用*/
            //如果使用了回调参数，则直接调用参数中指定的函数，否则调用pageIndexChang函数
            if (typeof (indexChangeCallback) == "function") {
                indexChangeCallback(currentpage + 1);
            } else {
                pageIndexChang(currentpage + 1);
            }
            /*修改当前页数值*/
            $("#currentPage").val(currentpage + 1);
            /*翻页成功后，当前页样式处理*/
            $(".paginate_button").each(function (index, ele) {
                if (parseInt($(ele).children("a").text()) == currentpage + 1) {
                    $(ele).addClass("active");
                    $(ele).prev().removeClass("active");
                }
            });
            /*如果翻页后的当前页在第一页之后，说明可以返回上一页*/
            currentpage = parseInt($("#currentPage").val());
            if (currentpage > 1) {
                $("#previous").removeClass("disabled");
            }
        });

        //点击页码
        $(".pagenumber").bind("click", function () {
            var currentpage = parseInt($(this).children("a").text());
            if (typeof (indexChangeCallback) == "function") {
                indexChangeCallback(currentpage);
            } else {
                pageIndexChang(currentpage);
            }
            $("#currentPage").val(currentpage);
            $(".pagenumber").each(function (index, element) {
                $(element).removeClass("active");
            });
            $(this).addClass("active");

            if (currentpage > 1) {
                $("#previous").removeClass("disabled");
            } else {
                $("#previous").addClass("disabled");
            }
            if (currentpage + 1 > pageCount) {
                $("#next").addClass("disabled");
            } else {
                $("#next").removeClass("disabled");
            }
        });
    }
})();

