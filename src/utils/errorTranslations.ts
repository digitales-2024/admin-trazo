const errorTranslations = {
    Unauthorized: "No autorizado",
    "Invalid credentials": "Credenciales inválidas",
    "User not found": "Usuario no encontrado",
    "Unexpected error": "Ocurrió un error inesperado",
    "Password incorrect": "Contraseña incorrecta",
    "Access denied": "Acceso denegado",
    Forbidden: "Prohibido",
    "You must change your password": "Debes cambiar tu contraseña",
    "Bas Request": "Solicitud incorrecta",
    "the new password is too weak, it must contain at least one uppercase letter, one lowercase letter, one number":
        "La nueva contraseña es muy débil, debe contener al menos una letra mayúscula, una letra minúscula y un número",
    "the confirm password is too weak, it must contain at least one uppercase letter, one lowercase letter, one number":
        "La confirmación de la contraseña es muy débil, debe contener al menos una letra mayúscula, una letra minúscula y un número",
    "the new password is too weak, it must contain at least one uppercase letter, one lowercase letter, one numberthe confirm password is too weak, it must contain at least one uppercase letter, one lowercase letter, one number":
        "La nueva contraseña es muy débil, debe contener al menos una letra mayúscula, una letra minúscula y un número, la confirmación de la contraseña es muy débil, debe contener al menos una letra mayúscula, una letra minúscula y un número",
    "Error updating password": "Error actualizando la contraseña",
    "You do not need to change your password":
        "Ya actualizaste tu contraseña temporal",
    "Password current do not match": "La contraseña actual no coincide",
    "Passwords do not match": "Las contraseñas no coinciden",
    "New password must be different from the current password":
        "La nueva contraseña debe ser diferente a la actual",
    "the new password is too weak, it must contain at least one uppercase letter, one lowercase letter, one number,the confirm password is too weak, it must contain at least one uppercase letter, one lowercase letter, one number":
        "La nueva contraseña es muy débil, debe contener al menos una letra mayúscula, una letra minúscula y un número, la confirmación de la contraseña es muy débil, debe contener al menos una letra mayúscula, una letra minúscula y un número",
    "The new password must be different from the current one":
        "La nueva contraseña debe ser diferente a la contraseña temporal",
    "phone must be a phone number":
        "El teléfono debe ser un número de teléfono",
    "the password is too weak, it must contain at least one uppercase letter, one lowercase letter, one number,phone must be a phone number":
        "La contraseña es muy débil, debe contener al menos una letra mayúscula, una letra minúscula y un número, el teléfono debe ser un número de teléfono",
    "Email already exists": "El correo electrónico ya existe",
    "You cannot deactivate yourself": "No puedes desactivarte",
    "User not found or inactive": "Usuario no encontrado o inactivo",
    "service unavailable, please try again later":
        "Servicio no disponible, por favor intenta más tarde",
    "Email already exists but inactive, contact the administrator to reactivate the account":
        "El correo electrónico ya existe pero está inactivo, contacta al administrador para reactivar la cuenta",
    "You cannot update your own password":
        "Puedes actualizar tu propia contraseña en la sección de perfil",
    "Email not found": "Correo electrónico no encontrado",
    "contactNumber must be a valid phone number":
        "El número de contacto debe ser un número de teléfono válido",
    "Opening time must be earlier than closing time.":
        "El horario de apertura debe ser anterior al horario de cierre.",
    "Only one price in DOLAR is allowed for CHILD":
        "Solo se permite un precio en Dólar para Niño",
    "Only one price in SOL is allowed for CHILD":
        "Solo se permite un precio en Sol para Niño",
    "Only one price in DOLAR is allowed for ADULT":
        "Sole se permite un precio en Dólar para Adulto",
    "Only one price in SOL is allowed for ADULT":
        "Sole se permite un precio en Sol para Adulto",
    "Language name already exists": "El nombre de lenguaje ya existe",
    "Start time already exists": "La hora de inicio ya existe",
    "closeBeforeStartInterval cannot be greater than 300":
        "El intervalo de cierre antes del inicio no puede ser mayor a 300",
    "finalRegistrationCloseInterval cannot be greater than 300":
        "El intervalo final de cierre de registro no puede ser mayor a 300",
    "Role already exists": "El rol con este nombre ya existe",
    "Role name cannot be SUPER_ADMIN": "Solo puede existir un rol superadmin",
    "Role already exists with this name": "El rol ya existe con este nombre",
    "You cannot deactivate a role in use":
        "No puedes eliminar/desactivar un rol en uso",
    "name should not be empty": "El nombre no puede estar en blanco",
    "This category exists": "Esta categoría ya existe",
    "Failed to send email": "Error al enviar el correo electrónico",
    "This category is inactive, contact the superadmin to reactivate it":
        "Esta categoría está inactiva, contacta al superadmin para reactivarla",
    "Category assigned to active products":
        "No se puede eliminar la categoría porque está asignada a productos activos",
    "This client is inactive, contact the superadmin to reactivate it":
        "Este cliente está inactivo, contacta al superadmin para reactivarlo",
    "This space already exists": "Este ambiente ya existe",
    "This space exists but is not active":
        "Este ambiente existe pero no está activo",
    "levels should not be empty":
        "La asignación de niveles no puede estar en blanco",
    "phone must be a valid phone number":
        "El teléfono debe ser un número de teléfono válido",
    "This DNI is already in use": "Este DNI ya está en uso",
    "The length of the RUC or DNI is incorrect":
        "La longitud del RUC o DNI es incorrecta",
    "This RUC is already in use": "El RUC ya está en uso",
    "This zoningCode already exists": "Este código de zonificación ya existe",
    "The sum of buildable area and open area must be 100":
        "La suma del área construible y el área libre debe ser 100",
    "startProjectDate must be a valid ISO 8601 date string":
        "La fecha de inicio de proyecto debe ser una fecha ISO 8601",
    "A design project already exists for this quotation":
        "Ya existe un proyecto de diseño para esta cotizacion",
    "Resource already exists": "Este recurso ya existe",
    "Error updating resource": "Error actualizando recurso",
    "This resource is inactive, contact the superadmin to reactivate it":
        "Este recurso esta desactivado, contactese con el administrador para reactivarlo",
    "Used name": "Este nombre ya está en uso",
    "Workitem not found": "Partida no encontrada",
    "Bad workitem update": "Datos invalidos",
    "Subworkitem not found": "Subpartida no encontrada",
    "Parent Subcategory not found": "La subcategoría referenciada no existe",
    "This WorkItem does not exist": "Partida no encontrada",
    "This WorkItem exists but is not active":
        "La partida existe pero no está activa",
    "Invalid state. Contact an administrator":
        "Estado de la aplicación invalido.",
    "Subworkitem not foun": "Subpartida no encontrada",
    "Parent Work Item not found":
        "La Partida a la que pertenece esta Subpartida no se encontró",
    "The design project must be completed":
        "El proyecto de diseño debe estar completado",
    "category should not be empty":
        "La estructura del presupuesto no puede estar vacio",
    "This category has active subcategories":
        "Esta categoria tiene subcategorias activas",
    "This category exists but is not active":
        "Ya existe una categoria inactiva con este nombre",
    "This category exists, but is inactive":
        "Ya existe una categoria inactiva con este nombre",
    "This category already exists": "Ya existe una categoría con este nombre",
    "This category doesnt exist": "No existe esta categoría",
    "Category not found or inactive": "No existe esta categoría",
    "This subcategory doesnt exist": "No existe esta subcategoría",
    "This subcategory already exists":
        "Ya existe una categoría con este nombre",
    "This category exist, but is inactive":
        "Ya existe una categoría inactiva con este nombre",
    "category\\.(\\d+)\\.subcategory\\.(\\d+)\\.workItem\\.(\\d+)\\.subWorkItem\\.(\\d+)\\.apuBugdetId should not be empty":
        "Debe seleccionar un APU para la subpartida",
    "category\\.(\\d+)\\.subcategory\\.(\\d+)\\.workItem\\.(\\d+)\\.subWorkItem\\.(\\d+)\\.apuBugdetId must be a UUID":
        "Debe seleccionar un APU para la subpartida",
    "category\\.(\\d+)\\.subcategory\\.(\\d+)\\.workItem\\.(\\d+)\\.subWorkItem\\.(\\d+)\\.apuBugdetId must be a string":
        "Debe seleccionar un APU para la subpartida",
    "performance must be a positive number":
        "El rendimiento debe ser un número positivo",
    "workHours must be a positive number":
        "Las horas de trabajo deben ser un número positivo",
    "Expected to find 1 business":
        "Se debe definir la información del negocio primero",
    "category\\.(\\d+)\\.subcategory\\.(\\d+)\\.workItem should not be empty":
        "Debe seleccionar una partida para la subcategoria",
};

export default errorTranslations;
