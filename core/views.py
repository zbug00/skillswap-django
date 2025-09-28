from django.shortcuts import render,redirect
from django.contrib.auth.views import LoginView
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from .models import *
from .forms import *
from django.db import models
from django.urls import reverse_lazy

class CustomLoginView(LoginView):
    template_name = 'login.html'
    authentication_form = LoginForm
    redirect_authenticated_user = True

    def get_success_url(self):
        return reverse_lazy('profile')

def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "✅ Регистрация прошла успешно! Добро пожаловать в SkillSwap!")
            return redirect('profile')
    else:
        form = RegisterForm()
    return render(request, 'register.html', {'form': form})

@login_required
def exchange_create_from_proposal(request, proposal_id):
    proposal = get_object_or_404(Proposal, id=proposal_id)

    if proposal.user == request.user:
        messages.error(request, "❌ Вы не можете откликнуться на своё собственное предложение.")
        return redirect('proposals_list')
    
    exchange = Exchange.objects.create(
        user1=proposal.user,          
        user2=request.user,          
        proposal=proposal,
        status='активен',
        format=proposal.format,
    )

    messages.success(request, f"✅ Вы успешно откликнулись на предложение от {proposal.user.full_name}. Обмен создан.")
    return redirect('exchanges_list')

@login_required
def proposal_create_view(request):
    if request.method == 'POST':
        form = ProposalForm(request.POST, user=request.user)
        if form.is_valid():
            proposal = form.save(commit=False)
            proposal.user = request.user
            proposal.save()
            messages.success(request, '✅ Предложение успешно создано!')
            return redirect('proposals_list')
    else:
        form = ProposalForm(user=request.user)

    return render(request, 'proposal_create.html', {'form': form})

@login_required
def profile_view(request):
    user = request.user
    user_skills = user.user_skills.select_related('skill__category').all()
    user_proposals = Proposal.objects.filter(user=user).select_related('skill_offered', 'skill_wanted')
    user_exchanges = Exchange.objects.filter(
        models.Q(user1=user) | models.Q(user2=user)
    ).select_related('user1', 'user2', 'proposal', 'request')

    context = {
        'user': user,
        'user_skills': user_skills,
        'user_proposals': user_proposals,
        'user_exchanges': user_exchanges,
    }
    return render(request, 'profile.html', context)

def proposals_list_view(request):
    proposals = Proposal.objects.select_related('user', 'skill_offered', 'skill_wanted').all()
    return render(request, 'proposals_list.html', {'proposals': proposals})

def skills_list_view(request):
    skills = Skill.objects.select_related('category').all()
    return render(request, 'skills_list.html', {'skills': skills})

@login_required
def skill_create_view(request):
    if request.method == 'POST':
        form = SkillForm(request.POST)
        if form.is_valid():
            skill = form.save()
            UserSkill.objects.get_or_create(user=request.user, skill=skill)
            messages.success(request, f'✅ Навык "{skill.name}" успешно добавлен и привязан к вашему профилю!')
            return redirect('profile')
    else:
        form = SkillForm()
    
    return render(request, 'skill_create.html', {'form': form})

def home_view(request):
    categories = Category.objects.all()
    context = {
        "slides": [
            {
                "title": "asdsad",
                "text": "asdsad123",
                "sub_text": "asdsad213",
            },
        ],
        "categories": categories
    }
    return render(request, 'home.html', context=context)

@login_required
def exchanges_list_view(request):
    user = request.user
    exchanges = Exchange.objects.filter(
        models.Q(user1=user) | models.Q(user2=user)
    ).select_related(
        'user1', 'user2', 'proposal', 'request'
    ).order_by('-created_at')

    context = {
        'exchanges': exchanges,
    }
    return render(request, 'exchanges_list.html', context)