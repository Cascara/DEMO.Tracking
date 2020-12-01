$(document).ready(function () {

    var dtuDraftsSettings = {
        "bInfo": false,
        "bLengthChange": false,
        "oLanguage": {
            "oPaginate": {
                "sNext": "&raquo;",
                "sPrevious": "&laquo;"
            },
            "sSearch": "Buscar:",
            "sEmptyTable": "No tienes borradores."
        }
    };

    var dtuDrafts = $("#dtuDrafts").DataTable(dtuDraftsSettings);

    $('#dtuDrafts').delegate("tr.draft", "click", function (e) {
        var messageId = $(this).attr("data-message-id");

        var settings = {
            cache: false,
            url: '/Tracking/Message/GetOpen',
            data: { messageId: messageId },
            dataType: 'json'
        };

        $.ajax(settings)
            .done(function (response) {
                window.location.href = '/Activity/Internal?elementInstanceRefId=' + response.elementInstanceRefId + "&returnUrl=/";
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                ///TODO: Mensaje de alerta
            });
    });

});

