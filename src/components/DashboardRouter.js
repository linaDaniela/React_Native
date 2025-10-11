import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

// Dashboards
import AdminDashboard from "../../Screen/Dashboard/AdminDashboard";
import MedicoDashboard from "../../Screen/Dashboard/MedicoDashboard";
import PacienteDashboard from "../../Screen/Dashboard/PacienteDashboard";

// Screens del sistema
import CitasScreen from "../../Screen/Citas/CitasScreen";
import PacientesScreen from "../../Screen/Pacientes/PacientesScreen";
import MedicosScreen from "../../Screen/Medicos/MedicosScreen";
import EspecialidadesScreen from "../../Screen/Especialidades/EspecialidadesScreen";
import AdministradoresScreen from "../../Screen/Administradores/AdministradoresScreen";
import PerfilScreen from "../../Screen/Perfil/PerfilScreen";

// Screens específicas para médicos
import MisCitasMedico from "../../Screen/Medico/MisCitasMedico";
import MiAgendaMedico from "../../Screen/Medico/MiAgendaMedico";
import ReportesMedico from "../../Screen/Medico/ReportesMedico";


// Screens específicas para pacientes
import AgendarCitaPaciente from "../../Screen/Paciente/AgendarCitaPaciente";
import MisCitasPaciente from "../../Screen/Paciente/MisCitasPaciente";
import HistorialPaciente from "../../Screen/Paciente/HistorialPaciente";

const Stack = createNativeStackNavigator();

export default function DashboardRouter() {
  const { userType, user } = useAuth();

  console.log('DashboardRouter - userType:', userType);
  console.log('DashboardRouter - user:', user);

  // Función para obtener el dashboard según el tipo de usuario
  const getDashboardComponent = () => {
    console.log('getDashboardComponent - userType:', userType);
    switch (userType) {
      case 'admin':
        console.log('Retornando AdminDashboard');
        return AdminDashboard;
      case 'medico':
        console.log('Retornando MedicoDashboard');
        return MedicoDashboard;
      case 'paciente':
        console.log('Retornando PacienteDashboard');
        return PacienteDashboard;
      default:
        console.log('Retornando PacienteDashboard por defecto');
        return PacienteDashboard; // Por defecto
    }
  };

  const DashboardComponent = getDashboardComponent();

  return (
    <Stack.Navigator
      initialRouteName="MainDashboard"
      screenOptions={{
        headerShown: false
      }}
    >
      {/* Dashboard principal según el tipo de usuario */}
      <Stack.Screen 
        name="MainDashboard" 
        component={DashboardComponent}
        options={{
          title: userType === 'admin' ? 'Panel Admin' : 
                 userType === 'medico' ? 'Panel Médico' : 'Panel Paciente'
        }}
      />

      {/* Pantallas comunes para todos los usuarios */}
      <Stack.Screen 
        name="Citas" 
        component={CitasScreen}
        options={{ title: "Citas Médicas" }}
      />
      
      <Stack.Screen 
        name="Pacientes" 
        component={PacientesScreen}
        options={{ title: "Pacientes" }}
      />
      
      <Stack.Screen 
        name="Medicos" 
        component={MedicosScreen}
        options={{ title: "Médicos" }}
      />
      
      <Stack.Screen 
        name="Especialidades" 
        component={EspecialidadesScreen}
        options={{ title: "Especialidades" }}
      />
      
      <Stack.Screen 
        name="Administradores" 
        component={AdministradoresScreen}
        options={{ title: "Administradores" }}
      />
      
      <Stack.Screen 
        name="Perfil" 
        component={PerfilScreen}
        options={{ title: "Mi Perfil" }}
      />

      {/* Ruta condicional para MisCitas según el tipo de usuario */}
      <Stack.Screen 
        name="MisCitas" 
        component={userType === 'medico' ? MisCitasMedico : MisCitasPaciente}
        options={{ title: "Mis Citas" }}
      />

      {/* Rutas específicas para médicos */}
      {userType === 'medico' && (
        <>
          <Stack.Screen 
            name="MisCitasMedico" 
            component={MisCitasMedico}
            options={{ title: "Mis Citas" }}
          />
          <Stack.Screen 
            name="MiAgendaMedico" 
            component={MiAgendaMedico}
            options={{ title: "Mi Agenda" }}
          />
          <Stack.Screen 
            name="ReportesMedico" 
            component={ReportesMedico}
            options={{ title: "Reportes" }}
          />
        </>
      )}

      {/* Pantallas específicas para pacientes */}
      {userType === 'paciente' && (
        <>
          <Stack.Screen 
            name="AgendarCita" 
            component={AgendarCitaPaciente}
            options={{ title: "Agendar Cita" }}
          />
          <Stack.Screen 
            name="MisCitasPaciente" 
            component={CitasScreen}
            options={{ title: "Mis Citas" }}
          />
          <Stack.Screen 
            name="Historial" 
            component={HistorialPaciente}
            options={{ title: "Mi Historial Médico" }}
          />
          <Stack.Screen 
            name="Emergencias" 
            component={CitasScreen}
            options={{ title: "Emergencias" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}