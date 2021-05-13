//Declaración de enumeraciones según [DatosBasicos]
var Enums = Enums || {};
Enums.GruposUsuario = {
    AdminComisiones: "AdminComisiones",
    MultiUsuario: "MultiUsuario",
    SecretarioGeneral: "SecretarioGeneral",
    TalentoHumano: "TalentoHumano",
    JefeArea: "JefeArea",
    Usuario: ""
}

Enums.TipoDatoBasico = {
    Perfil: 1,
    Dependencia: 2,
    Cargo: 3,
    Codigo: 4,
    Grado: 5,
    TipoDocumentoIdentidad: 6,
    TipoSoporteUsuario: 7,
    TipoSoporteSolicitud: 8,
    TipoGastoComision: 9,
    TipoDesplazamiento: 10,
    TipoRutaDesplazamiento: 11,
    EstadoSolicitud: 12,
    Banco: 13,
    Aerolinea: 15,
    Pais: 16,
    Departamento: 17,
    Ciudad: 18,

};
Enums.DatoBasico = {
    Colombia : 167
}

Enums.GastoAdicional = {
    Transporte: 83,
    Alojamiento: 84,
    Alimentacion: 85
};

Enums.TipoDesplazamiento = {
    ViaticosFuncionarios: 86,
    GastosTransportesFuncionarios: 87,
    DesplazamientoContratista: 88,
    RutaAerea: 89
};

Enums.EstadoSolicitud = {
    PendienteAprobacionJefeArea: 93,
    AprobadoJefeArea: 94,
    PendienteAprobacionSecretario: 95,
    AprobadoSecretario: 96,
    EnDevolucion: 97,
    Rechazada: 98
};

Enums.TiposRuta = {
    Aerea: 90,
    Maritimo: 91,
    Terrestre: 92
};

//Declaración de tipos de datos básicos
var Listas = Listas || {};
Listas.TiposSoporteUsuario = [
    { Id: 65, Descripcion: 'SOPORTE DE RUT', Sigla: 'Rut' },
    { Id: 66, Descripcion: 'SOPORTE DE PASAPORTE', Sigla: 'Pasaporte' },
    { Id: 67, Descripcion: 'DECLARACIÓN JURAMENTADA', Sigla: 'DecJur' },
    { Id: 68, Descripcion: 'SOPORTE DE CONTRATO', Sigla: 'Cto' },
    { Id: 69, Descripcion: 'CERTIFICACIÓN BANCARIA', Sigla: 'CertBanc' },
];

Listas.TiposSoporteSolicitud = [
    { Id: 70, Descripcion: 'AGENDA DE COMISIÓN' },
    { Id: 71, Descripcion: 'CITACIÓN' },
    { Id: 72, Descripcion: 'PODER' },
    { Id: 73, Descripcion: 'FORMATO DE LIQUIDACIÓN DE VIÁTICOS O GASTOS DE DESPLAZAMIENTO' },
    { Id: 74, Descripcion: 'CERTIFICADO DE PERMANENCIA O ACTA' },
    { Id: 75, Descripcion: 'INFORME DE COMISIÓN' },
    { Id: 76, Descripcion: 'SOPORTES TERRESTRES' },
    { Id: 77, Descripcion: 'SOPORTES AÉREOS' },
    { Id: 78, Descripcion: 'PASABORDO' },
    { Id: 79, Descripcion: 'REPORTE CITEL' },
    { Id: 80, Descripcion: 'RESOLUCIÓN DE COMISIÓN' },
    { Id: 81, Descripcion: 'DOCUMENTO EQUIVALENTE A FACTURA' },
    { Id: 82, Descripcion: 'FORMATO DE INFORMACIÓN DE DESPLAZAMIENTO' },
];

Listas.TiposRuta = [
    { Id: 90, Descripcion: 'Aérea' },
    { Id: 91, Descripcion: 'Marítimo/Fluvial' },
    { Id: 92, Descripcion: 'Terrestre' }
];
