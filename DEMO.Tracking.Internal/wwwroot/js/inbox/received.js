$(document).ready(function () {
    $.fn.dataTable.moment('DD/MM/YYYY HH:mm');

    var dtuReceivedSettings = {
        "bInfo": false,
        "bLengthChange": false,
        "oLanguage": {
            "oPaginate": {
                "sNext": "&raquo;",
                "sPrevious": "&laquo;"
            },
            "sSearch": "Buscar:",
            "sEmptyTable": "No ha recibido actividades."
        }
    };

    var dtuReceived = $("#dtuReceived").DataTable(dtuReceivedSettings);

    $('#dtuReceived').delegate("tr.received", "click", function (e) {
        var messageId = $(this).attr("data-message-id");

        var settings = {
            cache: false,
            url: '/Tracking/Message/GetOpen',
            data: { messageId: messageId },
            dataType: 'json'
        };

        $.ajax(settings)
            .done(function (response) {
                window.location.href = '/Activity/Internal?elementInstanceRefId=' + response.elementInstanceRefId + "&returnUrl=/Inbox/Received";
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                ///TODO: Mensaje de alerta
            });
    });

});

