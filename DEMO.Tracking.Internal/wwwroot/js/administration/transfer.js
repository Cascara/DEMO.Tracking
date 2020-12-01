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
            "sSearch": "Buscar:",
            "sEmptyTable": "No existen trámites para transferir."
        }
    };

    var dtuProceduresInProcess = $("#dtuProceduresInProcess").DataTable(dtuProceduresInProcessSettings);

    $('#dtuProceduresInProcess').delegate("tr.inprocess", "click", function (e) {

        var procedureInstanceRefId = $(this).attr("data-procedure-ref-id");

        $('#ProcedureKey').html($(this).attr("data-procedure-key"));

        $('#dtuUserSelected tbody').html('');

        GetUserSelected(procedureInstanceRefId);
    });

    function GetUserSelected(procedureInstanceRefId) {
        var settings = {
            cache: false,
            url: '/Tracking/ProcedureInstance/GetUserSelected',
            data: { procedureInstanceRefId: procedureInstanceRefId },
            dataType: 'json'
        };

        $.ajax(settings)
            .done(function (response) {
                var reference = '';
                $('#dtuUserSelected tbody').html('');
                for (var i = 0; i < response.length; i++) {
                    AddUserSelectedRow(response[i].procedureInstanceRefId, response[i].key, response[i].userId, response[i].givenName, response[i].familyName, response[i].eMail);
                }
                $('#divModalUserSelected').modal('show');
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                alert('No fue posible encontrar el trámite.');
            });
    }

    $('#dtuUserSelected').delegate("tr", "click", function () {
        var procedureInstanceRefId = $(this).attr("data-procedure-ref-id");
        var key = $(this).attr("data-key");
        var userId = $(this).attr("data-user-id");

        $('#transfer').attr('data-procedure-ref-id', procedureInstanceRefId);
        $('#transfer').hide();
        $('#rol').val(key);
        $('#transfer').attr('data-user-id', userId);
        $('#userId').val(userId);

        $('#transferSelected').show();
    });

    $('#userId').change(function (e) {
        if ($(this).val() !== $('#transfer').attr('data-user-id')) {
            $('#transfer').show();
        } else {
            $('#transfer').hide();
        }
    });

    $('#closeUserSelected').click(function () {
        ResetTransferSelected();
    });

    function ResetTransferSelected() {
        $('#transferAll').removeAttr('disabled');
        $('#rol').val('');
        $('#userId').val('');
        $('#transfer').attr('data-user-id', '');
        $('#transfer').attr('data-procedure-ref-id', '');
        $('#transfer').hide();
        $('#transfer').removeAttr('disabled');
        $('#transferSelected').hide();
    }

    $('#transfer').click(function (e) {
        var r = confirm('¿Está seguro que desea tranferir el rol ' + $('#rol').val() + ' a ' + $('#userId option:selected').text() + '?');
        if (r === true) {
            $('#transfer').attr('disabled');            

            var settings = {
                cache: false,
                url: '/Tracking/ProcedureInstance/Transfer',
                data: {
                    procedureInstanceRefId: $('#transfer').attr('data-procedure-ref-id'),
                    destinyUserId: $('#userId').val(),
                    key: $('#rol').val()
                },
                dataType: 'json'
            };

            $.ajax(settings)
                .done(function (response) {
                    GetUserSelected($('#transfer').attr('data-procedure-ref-id'));
                    ResetTransferSelected();
                    alert('La transferencia fue exitosa.');
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    alert('Ocurrio un error al intentar hacer la transferencia.');
                    $('#transfer').removeAttr('disabled');
                });
        } else {
            $('#userId').val($('#transfer').attr('data-user-id'));
            $('#transfer').hide();
        }
    });

    function AddUserSelectedRow(procedureInstanceRefId, key, userId, givenName, familyName, eMail) {        

            var activity = '<tr data-procedure-ref-id="' + procedureInstanceRefId + '" data-key="' + key + '" data-user-id="' + userId + '" style="cursor: pointer;">';

            activity += '<td>' + key + '</td>';
            activity += '<td>' + familyName + ' ' + givenName + '</td>';

            activity += '</tr>';
            $("#dtuUserSelected tbody").append(activity);

    }

    $('#transferAll').click(function (e) {
        var valid = true;

        if ($('#source').val() === '' || $('#destiny').val() === '') {
            valid = false;
        }

        if (valid) {
            $(this).attr('disabled', true);

            var r = prompt('¿Está seguro que desea tranferir todas las actividades actuales y futuras de ' + $('#source option:selected').text() + ' a ' + $('#destiny option:selected').text() + '? Ingrese el nombre del destinatario en el recuadro para continuar', "");

            if (r === $('#destiny option:selected').text()) {
                var settings = {
                    cache: false,
                    url: '/Tracking/ProcedureInstance/TransferAll',
                    data: {
                        sourceUserId: $('#source').val(),
                        destinyUserId: $('#destiny').val()
                    },
                    dataType: 'json'
                };

                $.ajax(settings)
                    .done(function (response) {
                        alert('La transferencia fue exitosa.');
                        $('#transferAll').removeAttr('disabled');
                        $('#source').val('');
                        $('#destiny').val('');
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        alert('Ocurrio un error al intentar hacer la transferencia.');
                        $('#transferAll').removeAttr('disabled');
                    });

            } else {
                alert('La transferencia se canceló porque no introdujo el destinatario correctamente.');
                $('#transferAll').removeAttr('disabled');
            }
        } else {
            alert('Complete los campos obligatorios para continuar.');
        }        
    });
});
