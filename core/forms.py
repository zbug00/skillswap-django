from django import forms
from .models import Proposal, Skill

class ProposalForm(forms.ModelForm):
    class Meta:
        model = Proposal
        fields = ['skill_offered', 'skill_wanted', 'description', 'format', 'deadlines']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4, 'placeholder': 'Опишите детали обмена...'}),
            'deadlines': forms.TextInput(attrs={'placeholder': 'Например: до 10 июня'}),
        }
        labels = {
            'skill_offered': 'Навык, который вы предлагаете',
            'skill_wanted': 'Навык, который хотите получить',
            'format': 'Формат занятий',
            'deadlines': 'Сроки (необязательно)',
            'description': 'Дополнительное описание',
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        if user:
            # Фильтруем навыки только пользователя
            self.fields['skill_offered'].queryset = Skill.objects.filter(
                id__in=user.user_skills.values_list('skill_id', flat=True)
            )
            self.fields['skill_wanted'].queryset = Skill.objects.all()