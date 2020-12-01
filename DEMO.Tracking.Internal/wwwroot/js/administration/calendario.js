$(document).ready(function () {

    $('#datetime').mask('00/00/0000 00:00');

    var dtuFechasSettings = {
        "dom": '<"pull-left"f><"pull-right xfecha">rt<"pdt-right"p>',
        "bInfo": false,
        "bLengthChange": false,
        "oLanguage": {
            "oPaginate": {
                "sNext": "&raquo;",
                "sPrevious": "&laquo;"
            },
            "sSearch": "Buscar:",
            "sEmptyTable": "No existen fechas."
        },
        "columns": [
            { "data": "key" },
            { "data": "name" },
            { "data": "content" }
        ],
        "data": fechas,
        "createdRow": function (row, data, dataIndex) {
            $(row).css("cursor", "pointer");
        }
    };

    var dtuFechas = $("#dtuFechas").DataTable(dtuFechasSettings);

    function GetFechas() {
        var settings = {
            cache: false,
            url: '/Administration/BusinessRule/GetList',
            dataType: 'json'
        };

        $.ajax(settings)
            .done(function (r) {
                dtuFechas.clear().draw();
                dtuFechas.rows.add(r).draw();
            });
    }

    $('#dtuFechas').delegate("tr", "click", function (e) {

        var fecha = dtuFechas.row($(e.target.parentNode)[0]._DT_RowIndex).data();

        $('#key').val(fecha.key);
        $('#name').val(fecha.name);
        $('#datetime').val(fecha.content);

        $('#divModalFecha').modal('show');

    });

    $('#save').click(function (e) {
        var r = confirm('¿Está seguro que desea guardar la fecha?');
        if (r === true) {
            var settings = {
                cache: false,
                url: '/Administration/BusinessRule/Set?key=' + $('#key').val() + '&content=' + $('#datetime').val(),
                dataType: 'json'
            };

            $.ajax(settings)
                .done(function (response) {
                    GetFechas();

                    $('#divModalFecha').modal('hide');
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    alert("Ocurrio un error, intente de nuevo.");
                });
        }
    });
});
