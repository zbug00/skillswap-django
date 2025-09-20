from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import ProposalForm
from .models import *
from django.db import models

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

def home_view(request):
    return render(request, 'home.html')

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