# 🏗️ Infrastructure as Code

This directory contains all infrastructure definitions and deployment configurations for the Conduit Portfolio project.

## Structure

- **`docker/`** - Docker configurations and multi-stage builds
- **`k8s/`** - Kubernetes manifests and Helm charts
- **`terraform/`** - Terraform modules and configurations

## Infrastructure Components

### Docker (`docker/`)
- Application Dockerfiles
- Docker Compose configurations
- Multi-stage build optimizations
- Development environment setup

### Kubernetes (`k8s/`)
- Deployment manifests
- Service definitions
- ConfigMaps and Secrets
- Ingress configurations
- Helm charts for complex deployments

### Terraform (`terraform/`)
- AWS/GCP/Azure resource definitions
- Network and security configurations
- Database and storage provisioning
- CI/CD pipeline infrastructure

## Environments

- **Development** - Local Docker Compose setup
- **Staging** - Kubernetes cluster with limited resources
- **Production** - Full Kubernetes deployment with scaling

## Usage

```bash
# Local development
docker-compose up -d

# Deploy to staging
kubectl apply -f k8s/staging/

# Provision infrastructure
terraform plan -var-file="production.tfvars"
terraform apply
```

## Security

- All secrets managed through external secret stores
- Network policies enforce least privilege access
- Regular security scanning of container images
- Infrastructure follows security best practices 