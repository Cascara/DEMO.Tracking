$(document).ready(function () {
    $.fn.dataTable.moment('DD/MM/YYYY HH:mm');

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
                "data": "name",
                "render": function (data, type, row, meta) {
                    var content = JSON.parse(row.content);
                    return '<strong>' + content.UserContent.Interesado + '</strong>';
                }
            },
            {
                "data": "rfc",
                "render": function (data, type, row, meta) {
                    var content = JSON.parse(row.content);
                    return content.UserContent.RFC;
                }
            },
            { "data": "key" }
            
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
                $('#divModalActivities').modal('show');
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                ///TODO: Mensaje de alerta
            });
    });

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


        activity += '<td>' + catalogId + '</td>';
        activity += '<td><strong>' + name + '</strong><br />' + userName + '</td>';
        activity += '<td style="text-align: center;"><a href="/Repository/Internal?elementInstanceRefId=' + refId + '" target="_blank"><i class="fa fa-external-link"></i></a></td>';
        if (catalogId === 'LIC_IFT8_01.0' || catalogId === 'LIC_IFT8_04.0' || catalogId === 'LIC_IFT8_04.1') {
            activity += '<td style="text-align: center;"><a href="javascript:void(0);" class="documentos" data-forminstance-id="' + formInstanceId + '" data-name="' + catalogId + ' - ' + name + '"><i class="fa fa-files-o"></i></a></td>';
        } else {
            activity += '<td>&nbsp;</td>';
        }
        

        activity += '</tr>';
        $("#dtuActivities tbody").append(activity);
    }

    $('#dtuActivities').delegate("a.documentos", "click", function (e) {

        $('#descargarzip').attr('data-systemnames', '');

        $('#ActivityName').text($(this).attr('data-name'));

        $('#dtuDocuments tbody').html('');

        var settings = {
            cache: false,
            url: '/Repository/InformationDocuments',
            data: { formInstanceId: $(this).attr('data-forminstance-id') },
            dataType: 'json'
        };

        $.ajax(settings)
            .done(function (response) {
                var reference = '';
                $('#dtuDocuments tbody').html('');
                if (response.length === 0) {
                    $("#dtuDocuments tbody").append('<tr><td colspan="4" style="text-align: center;">No hay documentos para esta actividad</td></tr>');
                } else {
                    for (var i = 0; i < response.length; i++) {
                        AddDocumentRow(response[i]);
                    }
                }
                $('#divModalDocuments').modal('show');
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                ///TODO: Mensaje de alerta
            });
    });

    function AddDocumentRow(document) {
        var created = new Date(document.createdDate);

        var systemNames = $('#descargarzip').attr("data-systemnames");

        systemNames += document.systemName + ',';

        $('#descargarzip').attr('data-systemnames', systemNames);

        var activity = '<tr>';
        activity += '<td><strong>' + document.originalName + '</strong></td>';
        activity += '<td>' + document.size + '</td>';
        activity += '<td>' + created.format('dd/mm/yyyy HH:MM') + '</td>';
        activity += '<td style="text-align: center;"><a href="' + $('#divModalDocuments').attr('data-apibox') + '/Execution/Box/Download?systemName=' + document.systemName + '" target="_blank"><i class="fa fa-file-o"></i></a></td>';

        activity += '</tr>';
        $("#dtuDocuments tbody").append(activity);
    }

    $('#descargarzip').click(function (e) {
        var url = $('#divModalDocuments').attr('data-apibox') + '/Execution/Box/DownloadZip?documents=' + $('#descargarzip').attr("data-systemnames");
        url = url.substring(0, url.length - 1);
        window.open(url, '_blank');
    });
});
