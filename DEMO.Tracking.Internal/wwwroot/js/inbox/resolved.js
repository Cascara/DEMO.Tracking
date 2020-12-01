$(document).ready(function () {
    $.fn.dataTable.moment('DD/MM/YYYY HH:mm');

    var dtuProceduresResolvedSettings = {
        "bInfo": false,
        "bLengthChange": false,
        "oLanguage": {
            "oPaginate": {
                "sNext": "&raquo;",
                "sPrevious": "&laquo;"
            },
            "sSearch": "Buscar:",
            "sEmptyTable": "No existen trámites resueltos."
        }
    };

    var dtuProceduresResolved = $("#dtuProceduresResolved").DataTable(dtuProceduresResolvedSettings);

    $('#dtuProceduresResolved').delegate("tr.resolved", "click", function (e) {
        var procedureInstanceRefId = $(this).attr("data-procedure-ref-id");
        var documentsSignedZiped = $(this).attr("data-documents-signed-ziped");
        $('#ProcedureKey').html($(this).attr("data-procedure-key"));

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
                $('#dtuActivities tbody').html('');
                for (var i = 0; i < response.length; i++) {
                    if (reference !== response[i].reference) {
                        AddActivityHeadRow(response[i].reference);
                        reference = response[i].reference;
                    }
                    AddActivityRow(response[i].refId, response[i].name, response[i].userName, response[i].start, response[i].end, response[i].days, response[i].hours, response[i].catalogId, documentsSignedZiped);
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

    function AddActivityRow(refId, name, userName, start, end, days, hours, catalogId, documentsSignedZiped) {
        start = new Date(start);
        end = new Date(end);

        var activity = '<tr>';
        if (catalogId !== 'FONACOT/I/A0005')
            activity += '<td style="text-align: center;"><a href="/Activity/Internal?elementInstanceRefId=' + refId + '" target="_blank"><i class="fa fa-external-link"></i></a></td>';
        else
            activity += '<td style="text-align: center;"><a href="' + documentsSignedZiped + '" target="_blank"><i class="fa fa-cloud-download"></i></a></td>';
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
