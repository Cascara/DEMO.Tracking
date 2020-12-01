$(document).ready(function () {
    $.fn.dataTable.moment('DD/MM/YYYY HH:mm');

    var te = $("#dtuActivities").tableExport();

    var dtuProceduresInProcessSettings = {
        "bInfo": false,
        "bLengthChange": false,
        "oLanguage": {
            "oPaginate": {
                "sNext": "&raquo;",
                "sPrevious": "&laquo;"
            },
            "sSearch": "Buscar el resultado:",
            "sEmptyTable": "No hay resultado de la búsqueda, intente de nuevo."
        },
        "columns": [
            {
                "data": "key",
                "render": function (data, type, row, meta) {
                    return '<strong>' + row.key + '</strong>';
                }
            },
            {
                "data": "name",
                "render": function (data, type, row, meta) {
                    var content = JSON.parse(row.content);
                    return '<strong>' + row.name + '</strong><br />' + content.UserContent.Interesado + '<br />' + content.UserContent.RFC;
                }
            },
            {
                "data": "start",
                "render": function (data, type, row, meta) {
                    var start = new Date(row.start);
                    if (start.format('yyyy') !== '1')
                        return start.format('dd/mm/yyyy HH:MM');
                    else
                        return '';
                }
            },
            {
                "data": "end",
                "render": function (data, type, row, meta) {
                    var end = new Date(row.end);
                    if (end.format('yyyy') !== '1')
                        return end.format('dd/mm/yyyy HH:MM');
                    else
                        return '';
                }
            }
            
        ],
        "createdRow": function (row, data, dataIndex) {
            $(row).css("cursor", "pointer");
        }
    };

    var dtuProceduresInProcess = $("#dtuProceduresInProcess").DataTable(dtuProceduresInProcessSettings);

    $('#dtuProceduresInProcess').delegate("tr", "click", function (e) {
        var procedureInstance = dtuProceduresInProcess.row($(e.target.parentNode)[0]._DT_RowIndex).data();

        var content = JSON.parse(procedureInstance.content);

        $('#ProcedureKey').html(procedureInstance.key);

        $('#dtuActivities tbody').html('');

        var settings = {
            cache: false,
            url: '/Repository/Information',
            data: { procedureInstanceRefId: procedureInstance.refId },
            dataType: 'json'
        };

        $.ajax(settings)
            .done(function (response) {
                var reference = '';
                $('#dtuActivities tbody').html('');
                for (var i = 0; i < response.length; i++) {
                    AddActivityRow(response[i].refId, response[i].name, response[i].userName, response[i].start, response[i].end, response[i].days, response[i].hours, response[i].catalogId, content, response[i].formInstanceId);
                }
                ExportTable();
                $('#divModalActivities').modal('show');
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                ///TODO: Mensaje de alerta
            });
    });

    function ExportTable(a) {
        te.update({
            headings: true,                    // (Boolean), display table headings (th/td elements) in the <thead>
            footers: true,                     // (Boolean), display table footers (th/td elements) in the <tfoot>
            formats: ["xlsx"],    // (String[]), filetypes for the export
            filename: "Bitacora_" + $('#ProcedureKey').html(),                    // (id, String), filename for the downloaded file
            bootstrap: true,                   // (Boolean), style buttons using bootstrap
            position: "bottom",                // (top, bottom), position of the caption element relative to table
            ignoreRows: null,                  // (Number, Number[]), row indices to exclude from the exported file
            ignoreCols: null,                 // (Number, Number[]), column indices to exclude from the exported file
            ignoreCSS: ".tableexport-ignore"   // (selector, selector[]), selector(s) to exclude from the exported file
        });
    }

    $("#searchProcedures").click(function (e) {
        var nombre = $('#nombre').val();
        var rfc = $('#rfc').val();
        var numero = $('#folio').val();

        if (nombre !== '' || rfc !== '' || numero !== '') {

            var formData = new FormData();
            formData.append("nombre", nombre);
            formData.append("rfc", rfc);
            formData.append("folio", numero);

            var settings = {
                url: "/Repository/Search",
                data: formData,
                processData: false,
                contentType: false,
                enctype: "multipart/form-data",
                type: "POST",
                timeout: 1280000
            };

            $.ajax(settings)
                .done(function (response) {
                    dtuProceduresInProcess.clear().draw();
                    dtuProceduresInProcess.rows.add(response).draw(); 
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    ///TODO: Mensaje de alerta
                });

        } else {
            alert('Para realizar la busqueda, ingrese información en un elemento de búsqueda.');
        }

        
    });

    function AddActivityRow(refId, name, userName, start, end, days, hours, catalogId, content, formInstanceId) {
        start = new Date(start);
        end = new Date(end);

        var activity = '<tr>';

        activity += '<td style="text-align: center;"><a href="/Binnacle/Internal?elementInstanceRefId=' + refId + '" target="_blank"><i class="fa fa-external-link"></i></a></td>';

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
