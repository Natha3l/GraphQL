import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/client';
import { Text, View } from 'react-native';

// Import conditionnel pour éviter les erreurs
let supabase, apolloClient, AuthNavigator, MainNavigator, LoadingScreen;

try {
  const supabaseModule = require('./src/lib/supabase');
  supabase = supabaseModule.supabase;
  
  const apolloModule = require('./src/lib/apollo');
  apolloClient = apolloModule.apolloClient;
  
  AuthNavigator = require('./src/navigation/AuthNavigator').default;
  MainNavigator = require('./src/navigation/MainNavigator').default;
  LoadingScreen = require('./src/components/LoadingScreen').default;
} catch (error) {
  console.error('Import error:', error);
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setError('Configuration Supabase manquante');
      setLoading(false);
      return;
    }

    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    }).catch(err => {
      console.error('Session error:', err);
      setError('Erreur de session');
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Écran d'erreur
  if (error) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, color: 'red', textAlign: 'center' }}>
            Erreur: {error}
          </Text>
          <Text style={{ marginTop: 10, textAlign: 'center' }}>
            Vérifiez la configuration Supabase et les fichiers du projet.
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  if (loading || !LoadingScreen) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Chargement...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  if (!apolloClient) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Erreur de configuration Apollo</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ApolloProvider client={apolloClient}>
        <StatusBar style="auto" />
        {session && MainNavigator ? (
          <MainNavigator />
        ) : AuthNavigator ? (
          <AuthNavigator />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Navigation non disponible</Text>
          </View>
        )}
      </ApolloProvider>
    </SafeAreaProvider>
  );
}