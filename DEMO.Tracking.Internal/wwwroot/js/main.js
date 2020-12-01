$(document).ready(function () {

    GetReceivedCount();

    $('#lnkNewPromotion').click(function () {

        var settings = {
            cache: false,
            url: '/Tracking/ProcedureInstance/Create',
            data: { procedureRefId: '6F44DF5A-15A7-4B35-A0DA-00D47D0A0E95' },
            dataType: 'json'
        };

        $.ajax(settings)
            .done(function (response) {
                window.location.href = '/Activity/Internal?elementInstanceRefId=' + response.elementInstanceRefId + "&returnUrl=/Inbox/Draft";
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                ///TODO: Mensaje de alerta
            });
    });

    function GetReceivedCount() {
        var settings = {
            cache: false,
            url: '/Tracking/Message/GetReceivedCount',
            dataType: 'json'
        };

        $.ajax(settings)
            .done(function (response) {
                if (response > 0) {
                    $('.receivedCount').html(response);
                    $('.receivedCountAlert').show();
                    $('#sobre').show();
                }
                else {
                    $('.receivedCount').html("");
                    $('.receivedCountAlert').hide();
                    $('#sobre').hide();
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                ///TODO: Mensaje de alerta
            });

        settings = {
            cache: false,
            url: '/Tracking/ProcedureInstance/GetInProcessCount',
            dataType: 'json'
        };

        $.ajax(settings)
            .done(function (response) {
                if (response > 0) {
                    $('#inProcessCount').html(response);
                }
                else {
                    $('#inProcessCount').html("");
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                ///TODO: Mensaje de alerta
            });

        setTimeout(GetReceivedCount, 60000);
    }
});