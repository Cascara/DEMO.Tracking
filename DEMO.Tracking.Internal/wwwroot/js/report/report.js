$(document).ready(function () {
    var url = $('#report').attr('data-url-integration');
    var qry = getParameterByName('_r');
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    var BuscarReporte = function (reporte) {
        var settings = {
            "url": url + "/ReporteJson/" + reporte,
            "method": "GET",
            "async": false,
            "timeout": 0,
        };

        $.ajax(settings).done(function (response) {

            if (response.Columns.length === 0 || response.Rows.length === 0) {
                alert("Lo sentimos, por el momento no hay información disponible para generar este reporte.");
            } else {
                $('.message').hide();
                $('.report').show();

                var reportSettings = {
                    "dom": '<"pull-left"f><"pull-right empleado">rt<"pull-left"p>',
                    "bInfo": false,
                    "bLengthChange": false,
                    "oLanguage": {
                        "oPaginate": {
                            "sNext": "&raquo;",
                            "sPrevious": "&laquo;"
                        },
                        "sSearch": "Buscar:",
                        "sEmptyTable": "Aún existen información para este reporte."
                    },
                    "columns": response.Columns,
                    "data": response.Rows,
                    "createdRow": function (row, data, dataIndex) {
                        $(row).css("cursor", "pointer");
                    }
                };

                $('#report').DataTable(reportSettings);
                
                $("#btnExport").show();
            }

            

        });
    };

    if (qry !== null) {
        BuscarReporte(qry);
    }

    $("#btnExport").click(function () {
        window.open(url + "/Reporte/" + qry, "_blank");
    });

});