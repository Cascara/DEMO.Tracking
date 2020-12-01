$(document).ready(function () {

    var dtuEmpleadosSettings = {
        "dom": '<"pull-left"f><"pull-right empleado">rt<"pdt-right"p>',
        "bInfo": false,
        "bLengthChange": false,
        "oLanguage": {
            "oPaginate": {
                "sNext": "&raquo;",
                "sPrevious": "&laquo;"
            },
            "sSearch": "Buscar:",
            "sEmptyTable": "No existen empleados."
        },
        "columns": [
            { "data": "id" },
            { "data": "nombre" },
            { "data": "apellidos" },
            { "data": "userName" },
            { "data": "reference" }
        ],
        "data": empleados,
        "createdRow": function (row, data, dataIndex) {
            $(row).css("cursor", "pointer");
        }
    };

    var dtuEmpleados = $("#dtuEmpleados").DataTable(dtuEmpleadosSettings);

    function GetEmpleados() {
        var settings = {
            cache: false,
            url: '/Administration/Empleado/GetList?rolId=0',
            dataType: 'json'
        };

        $.ajax(settings)
            .done(function (r) {
                dtuEmpleados.clear().draw();
                dtuEmpleados.rows.add(r).draw();
            });
    }

    $('.empleado').html('<span id="addEmpleado" style="cursor: pointer;"><a href="#"><i class="glyphicon glyphicon-plus" style="padding-right: 5px;"></i></a>Agregar empleado</span>');

    $('#addEmpleado').click(function (e) {
        $('#eNumero').val('');
        $('#eNombre').val('');
        $('#eApellidos').val('');
        $('#eUserName').val('');
        $('#eRFC').val('');

        $('#divModalEmpleado').attr('data-user-id', '00000000-0000-0000-0000-000000000000');

        $('#divModalEmpleado').modal('show');
    });

    $('#dtuEmpleados').delegate("tr", "click", function (e) {

        var empleado = dtuEmpleados.row($(e.target.parentNode)[0]._DT_RowIndex).data();

        var settings = {
            cache: false,
            url: '/Administration/Empleado/Get',
            data: { id: empleado.id },
            dataType: 'json'
        };

        $.ajax(settings)
            .done(function (response) {
                $('#eNumero').val(empleado.id);
                $('#eNombre').val(empleado.nombre);
                $('#eApellidos').val(empleado.apellidos);
                $('#eUserName').val(empleado.userName);
                $('#eRFC').val(empleado.reference);
                $('#divModalEmpleado').attr("data-user-id", empleado.userId);

                $('#divModalEmpleado').modal('show');
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                ///TODO: Mensaje de alerta
            });
    });

    $('#save').click(function (e) {
        var r = confirm('¿Está seguro que desea guardar el empleado?');
        if (r === true) {
            var empleado = {
                id: $('#eNumero').val(),
                nombre: $('#eNombre').val(),
                apellidos: $('#eApellidos').val(),
                userName: $('#eUserName').val(),
                reference: $('#eRFC').val(),
                userId: $('#divModalEmpleado').attr('data-user-id')
            };

            var settings = {
                cache: false,
                url: '/Administration/Empleado/Set',
                data: empleado,
                dataType: 'json'
            };

            $.ajax(settings)
                .done(function (response) {
                    GetEmpleados();

                    $('#divModalEmpleado').modal('hide');
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    alert("Ingrese un nombre de usuario correcto e intente de nuevo");
                });
        }
    });
});
