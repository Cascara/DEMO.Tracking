$(document).ready(function () {
    function GetComments(refId) {
        var settings = {
            cache: false,
            url: '/Tracking/ProcedureInstance/GetComments',
            data: { procedureInstanceRefId: refId },
            dataType: 'json'
        };

        $.ajax(settings)
            .done(function (response) {
                var el = '#conversation';
                var comment;
                var userName;

                for (var i = 0; i < response.length; i++) {
                    comment = '<div class="message clearfix"><div class="chat-bubble ';
                    if (response[i].isMe)
                        comment += 'from-me">';
                    else {
                        comment += 'from-them">';
                        if (userName !== response[i].userName) {
                            comment += '<strong>' + response[i].userName + '</strong><br />';
                        }
                    }
                    comment += response[i].text + '</div></div>';
                    $(el).append(comment);
                    userName = response[i].userName;
                }

                if (response.length > 0) 
                    $('#commentsAlert').show();
                else
                    $('#commentsAlert').hide();
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                ///TODO: Mensaje de alerta
            });
    }

    GetComments($.jsonPreload.Activity.flowInstanceSummary.procedureInstanceSummary.refId);

    function AddComment(refId) {
        "" !== $("#comment").val() && $.ajax({
            cache: false,
            dataType: "json",
            type: "GET",
            data: {
                elementInstanceRefId: refId,
                comment: $("#comment").val()
            },
            url: "/Tracking/ProcedureInstance/SetComment"
        }).done(function (t, i, s) {
            var n = '#conversation';
            $(n).append('<div class="message clearfix"><div class="chat-bubble from-me">' + $("#comment").val() + "</div></div>"),
                $("#comment").val('');
        }).fail(function (e, t, i) { }).always(function (e, t, i) { })
    }

    $("#comment").on("keypress", function (i) {
        13 === i.which && AddComment($.jsonPreload.Activity.refId, $(this).val());
    });

    $("#procedureLog").click(function myfunction(e) {
        var procedureInstanceRefId = $.jsonPreload.Activity.flowInstanceSummary.procedureInstanceSummary.refId;
        $('#ProcedureKey').html($.jsonPreload.Activity.flowInstanceSummary.procedureInstanceSummary.key);

        $('#dtuActivities tbody').html('');

        var settings = {
            cache: false,
            url: '/Tracking/ProcedureInstance/GetLog',
            data: { procedureInstanceRefId: procedureInstanceRefId },
            dataType: 'json'
        };

        $.ajax(settings)
            .done(function (response) {
                var reference = '';
                for (var i = 0; i < response.length; i++) {
                    if (reference !== response[i].reference) {
                        AddActivityHeadRow(response[i].reference);
                        reference = response[i].reference;
                    }
                    AddActivityRow(response[i].refId, response[i].name, response[i].userName, response[i].start, response[i].end, response[i].days, response[i].hours);
                }
                $('#divModalActivities').modal('show');
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                ///TODO: Mensaje de alerta
            });
    });

    function AddActivityHeadRow(title) {
        var head = '<tr><td colspan="6" style=""><strong>' + title + '</strong></td><tr>';
        $("#dtuActivities tbody").append(head);
    }

    function AddActivityRow(refId, name, userName, start, end, days, hours) {
        start = new Date(start);
        end = new Date(end);

        var activity = '<tr>';
        activity += '<td style="text-align: center;"><a href="/Activity/Internal?elementInstanceRefId=' + refId + '" target="_blank"><i class="fa fa-external-link"></i></a></td>';
        activity += '<td>' + name + '</td>';
        activity += '<td>' + userName + '</td>';
        activity += '<td>' + start.format('dd/mm/yyyy HH:MM') + '</td>';

        if (end.format('yyyy') !== '1')
            activity += '<td>' + end.format('dd/mm/yyyy HH:MM') + '</td>';
        else
            activity += '<td><i class="fa fa-play" style="color: #efbb20;"></i></td>';

        activity += '<td><strong>' + days + '</strong>d <strong>' + hours + '</strong>h</td>';
        activity += '</tr>';
        $("#dtuActivities tbody").append(activity);
    }
});