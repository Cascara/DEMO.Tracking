function InstallationsFactory(o) {
    var result = { "Installations": [] };
    for (var i = 0; i < o.Installations.length; i++) {
        result.Installations.push({
            "Selected": false,
            "PaymentKey": "",
            "InstallationKey": o.Installations[i].installationKey,
            "InstallationAddress": o.Installations[i].installationAddress.Street + ' ' + o.Installations[i].installationAddress.ExtNum,
            "PermitCRE": o.Installations[i].permitCRE,
            "Status": "Incompleto",
            "StatusInstallations": false,
            "InstallationAddressDetail": {
                "Street": o.Installations[i].installationAddress.Street,
                "ExtNum": o.Installations[i].installationAddress.ExtNum,
                "ZipCode": o.Installations[i].installationAddress.ZipCode,
                "Area": o.Installations[i].installationAddress.Area,
                "State": o.Installations[i].installationAddress.State,
                "Town": o.Installations[i].installationAddress.Town
            },
            "StatusProgram": false,
            "LegalOpinionFile": {
                "Hash": undefined,
                "FileDetails": ""
            },
            "programDetails": {
                "DateConclusionProgram": "",
                "InstallationProgramFile": "",
                "AttachedProgramFile": "",
            }
        });

    }
    return result;
}

$.InstalationsLoad = InstallationsFactory(oPreloadData);

this.load($.InstalationsLoad);