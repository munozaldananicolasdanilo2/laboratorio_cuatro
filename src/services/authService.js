const { User } = require('../models');

/**
 * Autentica un usuario directamente contra la base de datos
 */
exports.login = async (username, password) => {
    try {
        const user = await User.findOne({ where: { username } });
        
        if (!user || password !== user.password) {
            return {
                success: false,
                statusCode: 401,
                message: 'Credenciales inválidas'
            };
        }

        await user.update({ session_status: 'active' });

        return {
            success: true,
            statusCode: 200,
            data: {
                user: {
                    id: user.id_user,
                    username: user.username,
                    status_sesion: true
                }
            },
            message: 'Autenticación exitosa'
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            message: 'Error al autenticar usuario'
        };
    }
};

/**
 * Valida si un usuario tiene sesión activa directamente en la base de datos
 */
exports.validateSession = async (username) => {
    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return {
                success: false,
                statusCode: 404,
                message: 'Usuario no encontrado'
            };
        }

        const isActive = user.session_status === 'active';

        return {
            success: true,
            statusCode: 200,
            data: {
                userId: user.id_user,
                username: user.username,
                session_status: user.session_status,
                isActive: isActive
            },
            message: isActive ? 'Sesión activa' : 'Sesión inactiva'
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            message: 'Error al validar sesión'
        };
    }
};

/**
 * Cierra la sesión de un usuario directamente en la base de datos
 */
exports.logout = async (username) => {
    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return {
                success: false,
                statusCode: 404,
                message: 'Usuario no encontrado'
            };
        }

        await user.update({ session_status: 'inactive' });

        return {
            success: true,
            statusCode: 200,
            data: {
                userId: user.id_user,
                username: user.username,
                session_status: 'inactive'
            },
            message: 'Logout exitoso'
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            message: 'Error al cerrar sesión'
        };
    }
};
