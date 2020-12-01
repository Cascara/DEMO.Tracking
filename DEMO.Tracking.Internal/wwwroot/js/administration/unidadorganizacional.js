$(document).ready(function () {

    var dtuUnidadesOrganizacionalesSettings = {
        "dom": '<"pull-left"f><"pull-right unidadorganizacional">rt<"pdt-right"p>',
        "bInfo": false,
        "bLengthChange": false,
        "oLanguage": {
            "oPaginate": {
                "sNext": "&raquo;",
                "sPrevious": "&laquo;"
            },
            "sSearch": "Buscar:",
            "sEmptyTable": "No existen unidades organizacionales."
        },
        "columns": [
            { "data": "id" },
            { "data": "nombre" },
            { "data": "numeroEmpleados" }
        ],
        "data": unidadesOrganizacionales,
        "createdRow": function (row, data, dataIndex) {
            $(row).css("cursor", "pointer");
        }
    };

    var dtuUnidadesOrganizacionales = $("#dtuUnidadesOrganizacionales").DataTable(dtuUnidadesOrganizacionalesSettings);

    function GetUnidadesOrganizacionales() {
        var settings = {
            cache: false,
            url: '/Administration/UnidadOrganizacional/GetList',
            dataType: 'json'
        };

        $.ajax(settings)
            .done(function (r) {
                dtuUnidadesOrganizacionales.clear().draw();
                dtuUnidadesOrganizacionales.rows.add(r).draw();
            });
    }

    $('.unidadorganizacional').html('<span id="addUnidadOrganizacional" style="cursor: pointer;"><a href="#"><i class="glyphicon glyphicon-plus" style="padding-right: 5px;"></i></a>Agregar unidad organizacional</span>');

    $('#addUnidadOrganizacional').click(function (e) {
        $('#ouNumero').val('');
        $('#ouNombre').val('');

        $('.divEmpleados').hide();
        dtuEmpleado.clear().draw();

        $('#divModalUnidadOrganizacional').attr('data-uo-id', '0');

        $('#divModalUnidadOrganizacional').modal('show');
    });

    $('#closeUnidad').click(function (e) {
        GetUnidadesOrganizacionales();

        $('#divModalUnidadOrganizacional').modal('hide');
    });

    var dtuEmpleadoSettings = {
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
            { "data": "rolNombre" }
        ]
    };

    var dtuEmpleado = $("#dtuEmpleado").DataTable(dtuEmpleadoSettings);

    $('.empleado').html('<span id="addEmpleado" style="cursor: pointer;"><a href="#"><i class="glyphicon glyphicon-plus" style="padding-right: 5px;"></i></a>Agregar empleado</span>');

    $('#addEmpleado').click(function (e) {
        $('#eNombre').val('');
        $('#eNombre').removeAttr("disabled");
        $('#rolId').val(0);

        $('#deleteEmpleado').hide();

        $('#divModalEmpleado').modal('show');
    });

    $('#dtuUnidadesOrganizacionales').delegate("tr", "click", function (e) {
        var unidadOrganizacional = dtuUnidadesOrganizacionales.row($(e.target.parentNode)[0]._DT_RowIndex).data();

        $('.divEmpleados').show();

        var settings = {
            cache: false,
            url: '/Administration/UnidadOrganizacional/Get',
            data: { unidadOrganizacionalId: unidadOrganizacional.id },
            dataType: 'json'
        };

        $.ajax(settings)
            .done(function (response) {
                SetUnidadOrganizacional(response);
                $('#divModalUnidadOrganizacional').modal('show');
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                alert('No fue posible obtener los empleados');
            });
    });

    function SetUnidadOrganizacional(u) {
        $('#divModalUnidadOrganizacional').attr('data-uo-id', u.id);

        $('#ouNumero').val(u.id);
        $('#ouNumero').attr("disabled", "disabled");
        $('#ouNombre').val(u.nombre);

        Empleados(u.empleados);

        $('.divEmpleados').show();
    }

    function Empleados(e) {
        dtuEmpleado.clear().draw();
        dtuEmpleado.rows.add(e).draw();
    }

    function GetEmpleados() {
        var settings = {
            cache: false,
            url: '/Administration/UnidadOrganizacional/GetEmpleados?unidadOrganizacionalId=' + $('#ouNumero').val(),
            dataType: 'json'
        };

        $.ajax(settings)
            .done(function (r) {
                Empleados(r);
            });
    }

    $('#dtuEmpleado').delegate("tr", "click", function (e) {
        var empleado = dtuEmpleado.row($(e.target.parentNode)[0]._DT_RowIndex).data();

        $('#eNombre').val(empleado.id);
        $('#eNombre').attr("disabled", "disabled");
        $('#rolId').val(empleado.rolId);
        $('#divModalEmpleado').attr("data-anterior-rol-id", empleado.rolId);

        $('#deleteEmpleado').show();

        $('#divModalEmpleado').modal('show');
    });

    $('#saveEmpleado').click(function (e) {
        var r = confirm('¿Está seguro que desea agregar al empleado?');
        if (r === true) {
            var settings = {
                cache: false,
                method: 'POST',
                contentType: "application/json;charset=utf-8",
                url: '/Administration/UnidadOrganizacional/SetEmpleado?unidadOrganizacionalId=' + $('#ouNumero').val() + '&empleadoId=' + $('#eNombre').val() + '&rolId=' + $('#rolId').val() + '&anteriorRolId=' + $('#divModalEmpleado').attr("data-anterior-rol-id"),
                dataType: 'json'
            };

            $.ajax(settings)
                .done(function (response) {
                    GetEmpleados();

                    $('#divModalEmpleado').modal('hide');
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    alert("No fue posible guardar la informacion del empleado");
                });
        }
    });

    $('#deleteEmpleado').click(function (e) {
        var r = confirm('¿Está seguro que desea eliminar al empleado de la unidad organizacional?');
        if (r === true) {
            var settings = {
                cache: false,
                method: 'POST',
                contentType: "application/json;charset=utf-8",
                url: '/Administration/UnidadOrganizacional/DeleteEmpleado?unidadOrganizacionalId=' + $('#ouNumero').val() + '&empleadoId=' + $('#eNombre').val() + '&rolId=' + $('#rolId').val(),
                dataType: 'json'
            };

            $.ajax(settings)
                .done(function (response) {
                    GetEmpleados();

                    $('#divModalEmpleado').modal('hide');
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    alert("No fue posible eliminar al empleado");
                });
        }
    });

    $('#saveUnidad').click(function (e) {
        var r = confirm('¿Está seguro que desea guardar la Unidad Organizacional?');
        if (r === true) {
            var settings = {
                cache: false,
                method: 'POST',
                contentType: "application/json;charset=utf-8",
                url: '/Administration/UnidadOrganizacional/Set?unidadOrganizacionalId=' + $('#ouNumero').val() + '&unidadOrganizacionalNombre=' + $('#ouNombre').val(),
                dataType: 'json'
            };

            $.ajax(settings)
                .done(function (response) {
                    GetUnidadesOrganizacionales();

                    $('#divModalUnidadOrganizacional').modal('hide');
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    alert("No fue posible guardar la informacion del empleado");
                });
        }
    });
});
