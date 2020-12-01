$(document).ready(function () {

    var dtuDocumentsSettings = {
        "dom": '<"pull-left"f><"pull-right document">rt<"pdt-right"p>',
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
            { "data": "name" },
            { "data": "type" },
            { "data": "grouper" }
        ]
    };

    var dtuDocuments = $("#dtuDocuments").DataTable(dtuDocumentsSettings);

    $('.document').html('<span id="addDocument" style="cursor: pointer;"><a href="#"><i class="glyphicon glyphicon-plus" style="padding-right: 5px;"></i></a>Agregar empleado</span>');

    $('#addDocument').click(function (e) {
        $('#dName').val('');
        $('#dType').val(0);
        $('#dAditional').val(0);
        $('#dGrouper').val('');


        $('#deleteDocument').hide();
        
        $('#divModalDocument').modal('show');
    });

    $('#dtuDocuments').delegate("tr", "click", function (e) {

        var document = dtuDocuments.row($(e.target.parentNode)[0]._DT_RowIndex).data();

        $('#dName').val(document.name);
        $('#dType').val(document.type);
        $('#dAditional').val(1);
        $('#dGrouper').val(document.grouper);

        $('#deleteDocument').show();


        $('#divModalDocument').modal('show');
    });



});
