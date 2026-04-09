#!/bin/bash
# Script de démarrage complet du système SmartSite Microservices

set -e

echo "================================================"
echo "  SmartSite Microservices - Startup Script"
echo "================================================"
echo ""

# Vérifier Docker
echo "✓ Vérification de Docker..."
if ! command -v docker &> /dev/null; then
    echo "✗ Docker n'est pas installé"
    exit 1
fi

echo "✓ Docker trouvé: $(docker --version)"
echo ""

# Vérifier Docker Compose
echo "✓ Vérification de Docker Compose..."
if ! docker compose version &> /dev/null; then
    echo "✗ Docker Compose n'est pas installé"
    exit 1
fi

echo "✓ Docker Compose trouvé"
echo ""

# Arrêter les anciens containers
echo "🛑 Arrêt des containers existants..."
docker-compose down --remove-orphans 2>/dev/null || true
echo ""

# Démarrer les services
echo "🚀 Démarrage des services..."
echo ""

docker-compose up -d

# Attendre que les services se stabilisent
echo ""
echo "⏳ Attente du démarrage des services (30 secondes)..."
sleep 30

# Vérifier le statut
echo ""
echo "📊 Statut des services:"
docker-compose ps

echo ""
echo "================================================"
echo "  ✅ Démarrage terminé!"
echo "================================================"
echo ""
echo "📍 Services accessibles:"
echo "   • API Gateway:   http://localhost:8080"
echo "   • Eureka Server: http://localhost:8761"
echo "   • Config Server: http://localhost:8888"
echo "   • RabbitMQ:      http://localhost:15672 (chedly/chedly)"
echo ""
echo "📝 Logs en temps réel:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Arrêt des services:"
echo "   docker-compose down"
echo ""
